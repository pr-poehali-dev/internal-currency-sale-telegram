"""
API для создания и обработки платежей через ЮKassa
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import requests
from uuid import uuid4
import jwt

def handler(event: dict, context) -> dict:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'create':
                return create_payment(event, body)
            elif action == 'webhook':
                return handle_webhook(body)
            else:
                return error_response('Неизвестное действие', 400)
        
        elif method == 'GET':
            return get_orders(event)
            
    except Exception as e:
        return error_response(str(e), 500)


def create_payment(event: dict, body: dict) -> dict:
    user_id = get_user_id_from_token(event)
    if not user_id:
        return error_response('Требуется авторизация', 401)
    
    order_type = body.get('order_type')
    amount = body.get('amount')
    months = body.get('months')
    price = body.get('price')
    telegram_user_id = body.get('telegram_user_id')
    
    if not order_type or not price:
        return error_response('Неполные данные заказа', 400)
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cursor.execute(
            """
            INSERT INTO orders (user_id, order_type, amount, months, price, telegram_user_id, status)
            VALUES (%s, %s, %s, %s, %s, %s, 'pending')
            RETURNING id
            """,
            (user_id, order_type, amount, months, price, telegram_user_id)
        )
        order = cursor.fetchone()
        order_id = order['id']
        conn.commit()
        
        shop_id = os.environ.get('YUKASSA_SHOP_ID')
        secret_key = os.environ.get('YUKASSA_SECRET_KEY')
        
        if not shop_id or not secret_key:
            return error_response('Платёжная система не настроена', 503)
        
        idempotence_key = str(uuid4())
        
        payment_data = {
            'amount': {
                'value': f'{price}.00',
                'currency': 'RUB'
            },
            'confirmation': {
                'type': 'redirect',
                'return_url': f'https://preview--internal-currency-sale-telegram.poehali.dev/?order_id={order_id}'
            },
            'capture': True,
            'description': f'Заказ #{order_id} - {order_type}',
            'metadata': {
                'order_id': order_id,
                'user_id': user_id
            }
        }
        
        response = requests.post(
            'https://api.yookassa.ru/v3/payments',
            json=payment_data,
            headers={
                'Idempotence-Key': idempotence_key,
                'Content-Type': 'application/json'
            },
            auth=(shop_id, secret_key)
        )
        
        if response.status_code != 200:
            return error_response(f'Ошибка создания платежа: {response.text}', 500)
        
        payment = response.json()
        payment_id = payment['id']
        confirmation_url = payment['confirmation']['confirmation_url']
        
        cursor.execute(
            "UPDATE orders SET payment_id = %s, status = 'processing' WHERE id = %s",
            (payment_id, order_id)
        )
        conn.commit()
        
        return success_response({
            'order_id': order_id,
            'payment_url': confirmation_url,
            'payment_id': payment_id
        })
        
    finally:
        cursor.close()
        conn.close()


def handle_webhook(body: dict) -> dict:
    event_type = body.get('event')
    payment_data = body.get('object', {})
    
    if event_type != 'payment.succeeded':
        return success_response({'message': 'Событие обработано'})
    
    payment_id = payment_data.get('id')
    status = payment_data.get('status')
    metadata = payment_data.get('metadata', {})
    order_id = metadata.get('order_id')
    
    if not order_id or status != 'succeeded':
        return success_response({'message': 'Платёж не успешен'})
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cursor.execute(
            """
            UPDATE orders 
            SET status = 'completed', 
                completed_at = CURRENT_TIMESTAMP,
                payment_method = 'yukassa'
            WHERE id = %s AND payment_id = %s
            RETURNING id, user_id, order_type, amount, months, telegram_user_id
            """,
            (order_id, payment_id)
        )
        order = cursor.fetchone()
        conn.commit()
        
        if order:
            deliver_order(order)
        
        return success_response({'message': 'Заказ выполнен'})
        
    finally:
        cursor.close()
        conn.close()


def deliver_order(order: dict):
    order_type = order['order_type']
    telegram_user_id = order['telegram_user_id']
    
    if order_type == 'star':
        print(f"Доставка {order['amount']} Stars пользователю {telegram_user_id}")
    elif order_type == 'premium':
        print(f"Активация Premium на {order['months']} мес для {telegram_user_id}")


def get_orders(event: dict) -> dict:
    user_id = get_user_id_from_token(event)
    if not user_id:
        return error_response('Требуется авторизация', 401)
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cursor.execute(
            """
            SELECT id, order_type, amount, months, price, status, payment_method, 
                   created_at, completed_at
            FROM orders
            WHERE user_id = %s
            ORDER BY created_at DESC
            LIMIT 50
            """,
            (user_id,)
        )
        orders = cursor.fetchall()
        
        orders_list = []
        for order in orders:
            orders_list.append({
                'id': order['id'],
                'type': order['order_type'],
                'amount': order['amount'],
                'months': order['months'],
                'price': order['price'],
                'status': order['status'],
                'payment_method': order['payment_method'],
                'date': order['created_at'].isoformat() if order['created_at'] else None,
                'completed_at': order['completed_at'].isoformat() if order['completed_at'] else None
            })
        
        return success_response({'orders': orders_list})
        
    finally:
        cursor.close()
        conn.close()


def get_user_id_from_token(event: dict) -> int:
    auth_header = event.get('headers', {}).get('X-Authorization', '')
    token = auth_header.replace('Bearer ', '')
    
    if not token:
        return None
    
    try:
        payload = jwt.decode(token, os.environ['JWT_SECRET'], algorithms=['HS256'])
        return payload.get('user_id')
    except:
        return None


def success_response(data: dict) -> dict:
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(data, ensure_ascii=False),
        'isBase64Encoded': False
    }


def error_response(message: str, status_code: int) -> dict:
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message}, ensure_ascii=False),
        'isBase64Encoded': False
    }
