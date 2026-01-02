import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

  const starPackages = [
    { amount: 100, price: 150, popular: false },
    { amount: 500, price: 700, popular: false },
    { amount: 1000, price: 1300, popular: true },
    { amount: 5000, price: 6000, popular: false },
    { amount: 10000, price: 11500, popular: false },
    { amount: 35000, price: 38000, popular: false },
  ];

  const premiumPackages = [
    { months: 1, price: 300, popular: false },
    { months: 3, price: 850, popular: false },
    { months: 6, price: 1600, popular: true },
    { months: 12, price: 3000, popular: false },
  ];

  const reviews = [
    { name: 'Алексей М.', rating: 5, text: 'Быстрая доставка Stars, всё прошло отлично! Рекомендую.', date: '15.12.2024' },
    { name: 'Мария К.', rating: 5, text: 'Купила Premium на год, цены лучше чем у официальных. Спасибо!', date: '10.12.2024' },
    { name: 'Дмитрий П.', rating: 5, text: 'Безопасная оплата, моментальное зачисление Stars. Буду заказывать ещё.', date: '05.12.2024' },
    { name: 'Елена С.', rating: 4, text: 'Всё хорошо, но хотелось бы больше способов оплаты.', date: '01.12.2024' },
  ];

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Star" className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TelegramStars</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <button onClick={() => scrollToSection('home')} className="text-sm font-medium hover:text-primary transition-colors">
              Главная
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium hover:text-primary transition-colors">
              Тарифы
            </button>
            <button onClick={() => scrollToSection('reviews')} className="text-sm font-medium hover:text-primary transition-colors">
              Отзывы
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-sm font-medium hover:text-primary transition-colors">
              Контакты
            </button>
          </nav>
          <Button onClick={() => scrollToSection('pricing')}>
            <Icon name="ShoppingCart" className="mr-2 h-4 w-4" />
            Купить
          </Button>
        </div>
      </header>

      <main>
        <section id="home" className="container py-24 md:py-32">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <Badge variant="secondary" className="w-fit">
                <Icon name="Shield" className="mr-1 h-3 w-3" />
                Безопасные платежи
              </Badge>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Telegram Stars и Premium по лучшим ценам
              </h1>
              <p className="text-xl text-muted-foreground">
                Официальный поставщик внутренней валюты Telegram. Моментальная доставка, защищённые платежи, круглосуточная поддержка.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => scrollToSection('pricing')} className="hover-scale">
                  <Icon name="Star" className="mr-2 h-5 w-5" />
                  Купить Stars
                </Button>
                <Button size="lg" variant="outline" onClick={() => scrollToSection('reviews')} className="hover-scale">
                  <Icon name="Users" className="mr-2 h-5 w-5" />
                  Отзывы клиентов
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 animate-fade-in">
              <Card className="hover-scale">
                <CardHeader>
                  <Icon name="Zap" className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Моментально</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Зачисление Stars в течение 1 минуты после оплаты</p>
                </CardContent>
              </Card>

              <Card className="hover-scale">
                <CardHeader>
                  <Icon name="Shield" className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Безопасно</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Двухфакторная аутентификация и шифрование данных</p>
                </CardContent>
              </Card>

              <Card className="hover-scale">
                <CardHeader>
                  <Icon name="TrendingDown" className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Выгодно</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Цены ниже официальных на 15-20%</p>
                </CardContent>
              </Card>

              <Card className="hover-scale">
                <CardHeader>
                  <Icon name="Headphones" className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Поддержка 24/7</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Онлайн-консультанты всегда на связи</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="pricing" className="container py-24 bg-accent/30">
          <div className="text-center space-y-4 mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Выберите тариф</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Гибкие пакеты Stars и Premium подписок для любых задач
            </p>
          </div>

          <Tabs defaultValue="stars" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
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
                  <Card key={pkg.amount} className={`relative hover-scale ${pkg.popular ? 'border-primary shadow-lg' : ''}`}>
                    {pkg.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                        Популярный
                      </Badge>
                    )}
                    <CardHeader>
                      <Icon name="Star" className="h-10 w-10 text-primary mb-2" />
                      <CardTitle className="text-2xl">{pkg.amount.toLocaleString()} Stars</CardTitle>
                      <CardDescription>Внутренняя валюта Telegram</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{pkg.price} ₽</div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {(pkg.price / pkg.amount).toFixed(2)} ₽ за 1 Star
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant={pkg.popular ? 'default' : 'outline'}>
                        <Icon name="ShoppingCart" className="mr-2 h-4 w-4" />
                        Купить
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="premium" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {premiumPackages.map((pkg) => (
                  <Card key={pkg.months} className={`relative hover-scale ${pkg.popular ? 'border-primary shadow-lg' : ''}`}>
                    {pkg.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                        Выгодно
                      </Badge>
                    )}
                    <CardHeader>
                      <Icon name="Crown" className="h-10 w-10 text-primary mb-2" />
                      <CardTitle className="text-2xl">{pkg.months} {pkg.months === 1 ? 'месяц' : pkg.months < 5 ? 'месяца' : 'месяцев'}</CardTitle>
                      <CardDescription>Telegram Premium</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{pkg.price} ₽</div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {Math.round(pkg.price / pkg.months)} ₽/месяц
                      </p>
                      <ul className="mt-4 space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                          <span>Увеличенные лимиты</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                          <span>Эксклюзивные стикеры</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                          <span>Быстрая загрузка</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant={pkg.popular ? 'default' : 'outline'}>
                        <Icon name="ShoppingCart" className="mr-2 h-4 w-4" />
                        Оформить
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section id="reviews" className="container py-24">
          <div className="text-center space-y-4 mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Отзывы клиентов</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Более 10,000 довольных покупателей уже доверили нам свои покупки
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {reviews.map((review, index) => (
              <Card key={index} className="hover-scale">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{review.name}</CardTitle>
                      <CardDescription>{review.date}</CardDescription>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Icon key={i} name="Star" className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{review.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-8 p-6 bg-accent/50 rounded-lg">
              <div>
                <div className="text-3xl font-bold text-primary">10,000+</div>
                <p className="text-sm text-muted-foreground">Довольных клиентов</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-bold text-primary">4.9</div>
                <p className="text-sm text-muted-foreground">Средняя оценка</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-bold text-primary">24/7</div>
                <p className="text-sm text-muted-foreground">Поддержка</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="container py-24 bg-accent/30">
          <div className="max-w-2xl mx-auto">
            <div className="text-center space-y-4 mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Свяжитесь с нами</h2>
              <p className="text-xl text-muted-foreground">
                Остались вопросы? Мы всегда рады помочь!
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <form className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Имя</label>
                    <Input id="name" placeholder="Введите ваше имя" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" type="email" placeholder="example@email.com" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Сообщение</label>
                    <Textarea id="message" placeholder="Опишите ваш вопрос" rows={5} />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    <Icon name="Send" className="mr-2 h-4 w-4" />
                    Отправить сообщение
                  </Button>
                </form>

                <div className="mt-8 pt-8 border-t">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon name="Mail" className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Email</div>
                        <div className="text-sm text-muted-foreground">support@telegramstars.ru</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon name="MessageCircle" className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Telegram</div>
                        <div className="text-sm text-muted-foreground">@telegramstars_support</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-secondary/5">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon name="Star" className="h-5 w-5 text-primary" />
                <span className="font-bold">TelegramStars</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Официальный поставщик Telegram Stars и Premium подписок
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Продукты</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-primary transition-colors">Telegram Stars</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-primary transition-colors">Premium подписка</button></li>
                <li><button className="hover:text-primary transition-colors">Оптовые заказы</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Компания</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => scrollToSection('reviews')} className="hover:text-primary transition-colors">Отзывы</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-primary transition-colors">Контакты</button></li>
                <li><button className="hover:text-primary transition-colors">О нас</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Безопасность</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Icon name="Shield" className="h-4 w-4 text-primary" />
                  <span>SSL шифрование</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Lock" className="h-4 w-4 text-primary" />
                  <span>2FA защита</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="CheckCircle" className="h-4 w-4 text-primary" />
                  <span>Проверенный продавец</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 TelegramStars. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
