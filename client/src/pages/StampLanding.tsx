import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Coins, TrendingUp, Users, Package, Award, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import './StampLanding.css';

interface StampStats {
  totalStamps: number;
  totalUSDValue: number;
  totalStampCoins: number;
  byRarity: Record<string, number>;
  byCountry: Record<string, number>;
}

export default function StampLanding() {
  const [stats, setStats] = useState<StampStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load statistics from JSON export
    fetch('/stamp-collection-export.json')
      .then(res => res.json())
      .then(data => {
        setStats(data.statistics);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load stamp collection:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="landing-loading">
        <Loader2 className="animate-spin" size={48} />
        <p>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="stamp-landing">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            🏛️ أرشيف الطوابع الرقمي
            <br />
            <span className="gradient-text">مجموعة نادرة من 81 طابعاً تاريخياً</span>
          </h1>
          <p className="hero-subtitle">
            حوّل الطوابع التاريخية الأصلية إلى NFTs على البلوكتشين
            <br />
            قيمة إجمالية: ${stats?.totalUSDValue.toLocaleString()} = {stats?.totalStampCoins.toLocaleString()} StampCoin
          </p>
          <div className="hero-actions">
            <Link href="/mint">
              <Button size="lg" className="primary-btn">
                <Award className="ml-2" />
                سك NFTs الآن
              </Button>
            </Link>
            <Link href="/archive">
              <Button size="lg" variant="outline" className="secondary-btn">
                <Package className="ml-2" />
                تصفح المجموعة
              </Button>
            </Link>
            <Link href="/economy">
              <Button size="lg" variant="outline" className="secondary-btn">
                <TrendingUp className="ml-2" />
                لوحة الاقتصاد
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-box">
            <Package className="stat-icon" />
            <div className="stat-number">{stats?.totalStamps}</div>
            <div className="stat-label">طابع أصلي</div>
          </div>
          <div className="stat-box">
            <Coins className="stat-icon" />
            <div className="stat-number">${stats?.totalUSDValue.toFixed(0)}</div>
            <div className="stat-label">القيمة الإجمالية</div>
          </div>
          <div className="stat-box">
            <TrendingUp className="stat-icon" />
            <div className="stat-number">{stats?.totalStampCoins.toLocaleString()}</div>
            <div className="stat-label">StampCoins</div>
          </div>
          <div className="stat-box">
            <Users className="stat-icon" />
            <div className="stat-number">{Object.keys(stats?.byCountry || {}).length}</div>
            <div className="stat-label">دولة</div>
          </div>
        </div>
      </section>

      {/* Rarity Distribution */}
      <section className="rarity-section">
        <h2 className="section-title">توزيع الندرة</h2>
        <div className="rarity-grid">
          <Card className="rarity-card legendary">
            <CardHeader>
              <CardTitle className="rarity-title">🏆 أسطوري</CardTitle>
              <CardDescription>{stats?.byRarity.legendary || 0} طوابع</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rarity-examples">
                <p>Inverted Jenny (USA)</p>
                <p>Penny Black (GB)</p>
                <p>Tre Skilling Bank (SE)</p>
              </div>
            </CardContent>
            <CardFooter>
              <Badge className="value-badge">متوسط $9,758/طابع</Badge>
            </CardFooter>
          </Card>

          <Card className="rarity-card very-rare">
            <CardHeader>
              <CardTitle className="rarity-title">💎 نادر جداً</CardTitle>
              <CardDescription>{stats?.byRarity.very_rare || 0} طوابع</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rarity-examples">
                <p>Portuguese Pereira</p>
                <p>Brazilian Bull's Eye</p>
                <p>Hawaiian Missionary</p>
              </div>
            </CardContent>
            <CardFooter>
              <Badge className="value-badge">متوسط $3,443/طابع</Badge>
            </CardFooter>
          </Card>

          <Card className="rarity-card rare">
            <CardHeader>
              <CardTitle className="rarity-title">🌟 نادر</CardTitle>
              <CardDescription>{stats?.byRarity.rare || 0} طابع</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rarity-examples">
                <p>35 دولة</p>
                <p>1840-1951</p>
                <p>إصدارات أولى</p>
              </div>
            </CardContent>
            <CardFooter>
              <Badge className="value-badge">متوسط $754/طابع</Badge>
            </CardFooter>
          </Card>

          <Card className="rarity-card uncommon">
            <CardHeader>
              <CardTitle className="rarity-title">⭐ غير شائع</CardTitle>
              <CardDescription>{stats?.byRarity.uncommon || 0} طابع</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rarity-examples">
                <p>أشكال حديثة</p>
                <p>استثمار جيد</p>
                <p>متاح للجمع</p>
              </div>
            </CardContent>
            <CardFooter>
              <Badge className="value-badge">متوسط $232/طابع</Badge>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2 className="section-title">لماذا مجموعتنا؟</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3 className="feature-title">أصالة مضمونة</h3>
            <p className="feature-description">
              جميع الطوابع موثقة تاريخياً مع روابط من Wikimedia Commons
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3 className="feature-title">تسعير ذكي</h3>
            <p className="feature-description">
              خوارزمية متعددة العوامل تحسب القيمة بناءً على الندرة والحالة والتاريخ
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3 className="feature-title">NFT فريد</h3>
            <p className="feature-description">
              كل طابع له رقم متسلسل فريد ومنشور على Ethereum
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3 className="feature-title">اقتصاد مربوط</h3>
            <p className="feature-description">
              StampCoin مربوط بـ $0.10 ومدعوم بقيم الطوابع الفعلية
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">ابدأ مجموعتك الآن</h2>
          <p className="cta-description">
            احصل على طوابع نادرة كـ NFTs واستثمر في التاريخ
          </p>
          <Link href="/mint">
            <Button size="lg" className="cta-btn">
              سك أول NFT
              <ArrowRight className="mr-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
