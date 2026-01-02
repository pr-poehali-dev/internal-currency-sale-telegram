import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface CartItem {
  id: string;
  type: 'star' | 'premium';
  amount?: number;
  months?: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  type: 'star' | 'premium';
  amount?: number;
  months?: number;
  price: number;
  status: 'completed' | 'pending' | 'failed';
}

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');

  const starPackages = [
    { amount: 100, price: 89, popular: false, discount: '-40%' },
    { amount: 500, price: 399, popular: false, discount: '-35%' },
    { amount: 1000, price: 749, popular: true, discount: '-42%' },
    { amount: 5000, price: 3499, popular: false, discount: '-42%' },
    { amount: 10000, price: 6799, popular: false, discount: '-41%' },
    { amount: 35000, price: 22999, popular: false, discount: '-39%' },
  ];

  const premiumPackages = [
    { months: 1, price: 169, popular: false },
    { months: 3, price: 449, popular: false, discount: '-11%' },
    { months: 6, price: 849, popular: true, discount: '-16%' },
    { months: 12, price: 1599, popular: false, discount: '-21%' },
  ];

  const reviews = [
    { 
      name: 'Александр Петров', 
      rating: 5, 
      text: 'Покупал 1000 Stars для бота. Пришло моментально после оплаты через СБП! Цена намного выгоднее, чем напрямую в Telegram. Рекомендую всем, кто активно использует Stars.', 
      date: '25.12.2024',
      verified: true 
    },
    { 
      name: 'Мария Соколова', 
      rating: 5, 
      text: 'Оформила Premium на полгода. Очень удобно платить через свой банк, выбрала Тинькофф. Подписка активировалась сразу, все функции работают. Экономия ощутимая по сравнению с официальной ценой!', 
      date: '20.12.2024',
      verified: true 
    },
    { 
      name: 'Дмитрий Волков', 
      rating: 5, 
      text: 'Уже третий раз покупаю Stars здесь. Всегда быстро, надёжно и безопасно. В личном кабинете вся история заказов, очень удобно отслеживать. Цены лучшие на рынке, проверял.', 
      date: '18.12.2024',
      verified: true 
    },
    { 
      name: 'Елена Морозова', 
      rating: 5, 
      text: 'Сначала сомневалась, но решила попробовать купить Premium на месяц. Всё прошло гладко, оплата через ВТБ заняла буквально минуту. Теперь буду брать сразу на год, выгода очевидна!', 
      date: '15.12.2024',
      verified: true 
    },
    { 
      name: 'Игорь Новиков', 
      rating: 4, 
      text: 'Отличный сервис! Купил 5000 Stars по акции. Единственное, хотелось бы видеть больше способов оплаты, но СБП работает отлично. Поддержка ответила быстро на мой вопрос.', 
      date: '12.12.2024',
      verified: true 
    },
    { 
      name: 'Анна Лебедева', 
      rating: 5, 
      text: 'Premium подписка на год обошлась дешевле на 30% чем в приложении! Оплатила через Сбер, всё активировалось мгновенно. Очень довольна, спасибо за такие цены и сервис!', 
      date: '10.12.2024',
      verified: true 
    },
  ];

  const banks = [
    { name: 'Сбербанк', logo: '🟢' },
    { name: 'Тинькофф', logo: '💛' },
    { name: 'Альфа-Банк', logo: '🔴' },
    { name: 'ВТБ', logo: '🔵' },
    { name: 'Райффайзен', logo: '🟡' },
    { name: 'Газпромбанк', logo: '🔵' },
    { name: 'ОТП Банк', logo: '🟢' },
    { name: 'Росбанк', logo: '🔴' },
    { name: 'Совкомбанк', logo: '🟠' },
    { name: 'Открытие', logo: '🔵' },
  ];

  const orderHistory: Order[] = [
    { id: '1', date: '15.12.2024', type: 'star', amount: 1000, price: 749, status: 'completed' },
    { id: '2', date: '10.12.2024', type: 'premium', months: 6, price: 849, status: 'completed' },
    { id: '3', date: '05.12.2024', type: 'star', amount: 500, price: 399, status: 'completed' },
  ];

  const addToCart = (item: CartItem) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  };

  const handleCheckout = () => {
    if (!selectedBank) return;
    alert(`Переход к оплате через ${selectedBank}. Сумма: ${getTotalPrice()} ₽`);
    setShowCheckout(false);
    setCart([]);
    setSelectedBank('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Icon name="Star" className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              TeleStars
            </span>
          </div>
          <nav className="hidden md:flex gap-6">
            <button className="text-sm font-medium hover:text-blue-600 transition-all hover:scale-105">
              Главная
            </button>
            <button className="text-sm font-medium hover:text-blue-600 transition-all hover:scale-105">
              Тарифы
            </button>
            <button className="text-sm font-medium hover:text-blue-600 transition-all hover:scale-105">
              Отзывы
            </button>
          </nav>
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Icon name="ShoppingCart" className="h-4 w-4" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                  <SheetDescription>Ваши товары готовы к оформлению</SheetDescription>
                </SheetHeader>
                <div className="space-y-4 py-6">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="ShoppingBag" className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">Корзина пуста</p>
                    </div>
                  ) : (
                    <>
                      {cart.map((item, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">
                                  {item.type === 'star' ? `${item.amount} Stars` : `Premium ${item.months} мес`}
                                </p>
                                <p className="text-sm text-muted-foreground">{item.price} ₽</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromCart(index)}
                              >
                                <Icon name="Trash2" className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <Separator />
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Итого:</span>
                        <span>{getTotalPrice()} ₽</span>
                      </div>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => setShowCheckout(true)}
                      >
                        Оформить заказ
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowProfile(true)}
            >
              <Icon name="User" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="container py-20 md:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8 animate-fade-in">
              <Badge variant="secondary" className="w-fit text-blue-600 border-blue-200">
                <Icon name="Sparkles" className="mr-1 h-3 w-3" />
                Скидки до 42%
              </Badge>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Telegram Stars и Premium
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Моментальная доставка Stars и активация Premium подписки. Оплата через СБП любым банком. Безопасно и выгодно.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  <Icon name="Sparkles" className="mr-2 h-5 w-5" />
                  Купить Stars
                </Button>
                <Button size="lg" variant="outline" className="border-2 hover:bg-slate-50 transition-all hover:scale-105">
                  <Icon name="Crown" className="mr-2 h-5 w-5" />
                  Premium подписка
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 animate-fade-in">
              {[
                { icon: 'Zap', title: 'Моментально', desc: 'Зачисление за 30 секунд' },
                { icon: 'Shield', title: 'Безопасно', desc: 'Защита данных и платежей' },
                { icon: 'Percent', title: 'Выгодно', desc: 'Скидки до 42%' },
                { icon: 'Headphones', title: '24/7', desc: 'Поддержка всегда на связи' },
              ].map((feature, i) => (
                <Card key={i} className="hover:shadow-lg transition-all hover:scale-105 hover:-translate-y-1 border-slate-200">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3">
                      <Icon name={feature.icon as any} className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-24 bg-white/50">
          <div className="container">
            <div className="text-center space-y-4 mb-12 animate-fade-in">
              <Badge variant="secondary" className="mx-auto text-blue-600 border-blue-200">
                <Icon name="Tag" className="mr-1 h-3 w-3" />
                Лучшие цены
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Выберите тариф</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Гибкие пакеты Stars и Premium подписок с максимальной выгодой
              </p>
            </div>

            <Tabs defaultValue="stars" className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
                <TabsTrigger value="stars" className="text-base">
                  <Icon name="Star" className="mr-2 h-4 w-4" />
                  Telegram Stars
                </TabsTrigger>
                <TabsTrigger value="premium" className="text-base">
                  <Icon name="Crown" className="mr-2 h-4 w-4" />
                  Premium подписка
                </TabsTrigger>
              </TabsList>

              <TabsContent value="stars" className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {starPackages.map((pkg) => (
                    <Card key={pkg.amount} className={`relative hover:shadow-xl transition-all hover:scale-105 hover:-translate-y-1 ${pkg.popular ? 'border-blue-500 border-2 shadow-lg' : 'border-slate-200'}`}>
                      {pkg.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg">
                            🔥 Популярный
                          </Badge>
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <Icon name="Star" className="h-6 w-6 text-white" />
                          </div>
                          <Badge variant="secondary" className="text-green-600 border-green-200">
                            {pkg.discount}
                          </Badge>
                        </div>
                        <CardTitle className="text-2xl">{pkg.amount.toLocaleString()} Stars</CardTitle>
                        <CardDescription>Внутренняя валюта Telegram</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-3xl font-bold text-blue-600">{pkg.price} ₽</div>
                          <p className="text-sm text-slate-500">
                            {(pkg.price / pkg.amount).toFixed(2)} ₽ за 1 Star
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          variant={pkg.popular ? 'default' : 'outline'}
                          onClick={() => addToCart({ id: `star-${pkg.amount}`, type: 'star', amount: pkg.amount, price: pkg.price })}
                        >
                          <Icon name="ShoppingCart" className="mr-2 h-4 w-4" />
                          В корзину
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="premium" className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {premiumPackages.map((pkg) => (
                    <Card key={pkg.months} className={`relative hover:shadow-xl transition-all hover:scale-105 hover:-translate-y-1 ${pkg.popular ? 'border-blue-500 border-2 shadow-lg' : 'border-slate-200'}`}>
                      {pkg.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg">
                            ⭐ Выгодно
                          </Badge>
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                            <Icon name="Crown" className="h-6 w-6 text-white" />
                          </div>
                          {pkg.discount && (
                            <Badge variant="secondary" className="text-green-600 border-green-200">
                              {pkg.discount}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-2xl">{pkg.months} {pkg.months === 1 ? 'месяц' : pkg.months < 5 ? 'месяца' : 'месяцев'}</CardTitle>
                        <CardDescription>Telegram Premium</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-3xl font-bold text-amber-600">{pkg.price} ₽</div>
                          <p className="text-sm text-slate-500">
                            {Math.round(pkg.price / pkg.months)} ₽/месяц
                          </p>
                          <ul className="space-y-2 text-sm">
                            {['Увеличенные лимиты', 'Эксклюзивные стикеры', 'Быстрая загрузка'].map((feature, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <Icon name="Check" className="h-4 w-4 text-green-600" />
                                <span className="text-slate-600">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          variant={pkg.popular ? 'default' : 'outline'}
                          onClick={() => addToCart({ id: `premium-${pkg.months}`, type: 'premium', months: pkg.months, price: pkg.price })}
                        >
                          <Icon name="ShoppingCart" className="mr-2 h-4 w-4" />
                          В корзину
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section id="reviews" className="container py-24">
          <div className="text-center space-y-4 mb-12 animate-fade-in">
            <Badge variant="secondary" className="mx-auto text-blue-600 border-blue-200">
              <Icon name="MessageCircle" className="mr-1 h-3 w-3" />
              Отзывы клиентов
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Что говорят наши клиенты</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Более 15,000 довольных покупателей выбрали TeleStars
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {reviews.map((review, index) => (
              <Card key={index} className="hover:shadow-xl transition-all hover:scale-105 hover:-translate-y-1 border-slate-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                          {review.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {review.name}
                          {review.verified && (
                            <Icon name="BadgeCheck" className="h-4 w-4 text-blue-600" />
                          )}
                        </CardTitle>
                        <CardDescription className="text-xs">{review.date}</CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mt-2">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Icon key={i} name="Star" className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 leading-relaxed">{review.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Card className="inline-flex items-center gap-12 p-8 shadow-lg border-slate-200">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">15,000+</div>
                <p className="text-sm text-slate-600 mt-1">Довольных клиентов</p>
              </div>
              <Separator orientation="vertical" className="h-16" />
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">4.9</div>
                <p className="text-sm text-slate-600 mt-1">Средняя оценка</p>
              </div>
              <Separator orientation="vertical" className="h-16" />
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">24/7</div>
                <p className="text-sm text-slate-600 mt-1">Поддержка</p>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-white/80">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Icon name="Star" className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold">TeleStars</span>
              </div>
              <p className="text-sm text-slate-600">
                Официальный поставщик Telegram Stars и Premium
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Продукты</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><button className="hover:text-blue-600 transition-colors">Telegram Stars</button></li>
                <li><button className="hover:text-blue-600 transition-colors">Premium подписка</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Компания</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><button className="hover:text-blue-600 transition-colors">Отзывы</button></li>
                <li><button className="hover:text-blue-600 transition-colors">О нас</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Безопасность</h3>
              <ul className="space-y-2 text-sm">
                {[
                  { icon: 'Shield', text: 'SSL шифрование' },
                  { icon: 'Lock', text: '2FA защита' },
                  { icon: 'CheckCircle', text: 'Проверенный продавец' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-600">
                    <Icon name={item.icon as any} className="h-4 w-4 text-blue-600" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-slate-600">
            <p>&copy; 2024 TeleStars. Все права защищены.</p>
          </div>
        </div>
      </footer>

      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Оформление заказа</DialogTitle>
            <DialogDescription>
              Выберите банк для оплаты через Систему Быстрых Платежей
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-600">Товаров в корзине:</span>
                <span className="font-medium">{cart.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Итоговая сумма:</span>
                <span className="text-2xl font-bold text-blue-600">{getTotalPrice()} ₽</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-3">Выберите банк:</p>
              <div className="grid grid-cols-2 gap-2">
                {banks.map((bank) => (
                  <Button
                    key={bank.name}
                    variant={selectedBank === bank.name ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setSelectedBank(bank.name)}
                  >
                    <span className="mr-2">{bank.logo}</span>
                    {bank.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full"
              size="lg"
              disabled={!selectedBank}
              onClick={handleCheckout}
            >
              <Icon name="CreditCard" className="mr-2 h-4 w-4" />
              Оплатить {getTotalPrice()} ₽ через {selectedBank || 'СБП'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Личный кабинет</DialogTitle>
            <DialogDescription>
              Ваши заказы и настройки аккаунта
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xl">
                  ИП
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">Иван Петров</h3>
                <p className="text-sm text-slate-600">ivan@example.com</p>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Icon name="History" className="h-4 w-4" />
                История заказов
              </h4>
              <div className="space-y-3">
                {orderHistory.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                            order.type === 'star' 
                              ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                              : 'bg-gradient-to-br from-amber-500 to-orange-500'
                          }`}>
                            <Icon name={order.type === 'star' ? 'Star' : 'Crown'} className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {order.type === 'star' ? `${order.amount} Stars` : `Premium ${order.months} мес`}
                            </p>
                            <p className="text-xs text-slate-500">{order.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">{order.price} ₽</p>
                          <Badge variant="secondary" className="text-xs text-green-600 border-green-200">
                            <Icon name="CheckCircle" className="h-3 w-3 mr-1" />
                            Выполнен
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
