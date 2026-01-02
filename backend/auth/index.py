"""
API для регистрации и авторизации пользователей
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import bcrypt
import jwt
from datetime import datetime, timedelta

def handler(event: dict, context) -> dict:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        if action == 'register':
            return register_user(body)
        elif action == 'login':
            return login_user(body)
        elif action == 'verify':
            return verify_token(event)
        else:
            return error_response('Неизвестное действие', 400)
            
    except Exception as e:
        return error_response(str(e), 500)


def register_user(body: dict) -> dict:
    email = body.get('email')
    password = body.get('password')
    telegram_id = body.get('telegram_id')
    
    if not email or not password:
        return error_response('Email и пароль обязательны', 400)
    
    if len(password) < 6:
        return error_response('Пароль должен быть минимум 6 символов', 400)
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cursor.execute(
            "SELECT id FROM users WHERE email = %s",
            (email,)
        )
        if cursor.fetchone():
            return error_response('Email уже зарегистрирован', 409)
        
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        cursor.execute(
            """
            INSERT INTO users (email, password_hash, telegram_id)
            VALUES (%s, %s, %s)
            RETURNING id, email, created_at
            """,
            (email, password_hash, telegram_id)
        )
        user = cursor.fetchone()
        conn.commit()
        
        token = generate_token(user['id'])
        
        return success_response({
            'message': 'Регистрация успешна',
            'token': token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'created_at': user['created_at'].isoformat()
            }
        })
        
    finally:
        cursor.close()
        conn.close()


def login_user(body: dict) -> dict:
    email = body.get('email')
    password = body.get('password')
    
    if not email or not password:
        return error_response('Email и пароль обязательны', 400)
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cursor.execute(
            "SELECT id, email, password_hash, created_at FROM users WHERE email = %s",
            (email,)
        )
        user = cursor.fetchone()
        
        if not user:
            return error_response('Неверный email или пароль', 401)
        
        if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            return error_response('Неверный email или пароль', 401)
        
        token = generate_token(user['id'])
        
        return success_response({
            'message': 'Авторизация успешна',
            'token': token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'created_at': user['created_at'].isoformat()
            }
        })
        
    finally:
        cursor.close()
        conn.close()


def verify_token(event: dict) -> dict:
    auth_header = event.get('headers', {}).get('X-Authorization', '')
    token = auth_header.replace('Bearer ', '')
    
    if not token:
        return error_response('Токен не предоставлен', 401)
    
    try:
        payload = jwt.decode(token, os.environ['JWT_SECRET'], algorithms=['HS256'])
        user_id = payload.get('user_id')
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        try:
            cursor.execute(
                "SELECT id, email, telegram_id, created_at FROM users WHERE id = %s",
                (user_id,)
            )
            user = cursor.fetchone()
            
            if not user:
                return error_response('Пользователь не найден', 404)
            
            return success_response({
                'user': {
                    'id': user['id'],
                    'email': user['email'],
                    'telegram_id': user['telegram_id'],
                    'created_at': user['created_at'].isoformat()
                }
            })
            
        finally:
            cursor.close()
            conn.close()
            
    except jwt.ExpiredSignatureError:
        return error_response('Токен истёк', 401)
    except jwt.InvalidTokenError:
        return error_response('Неверный токен', 401)


def generate_token(user_id: int) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=30)
    }
    return jwt.encode(payload, os.environ['JWT_SECRET'], algorithm='HS256')


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
