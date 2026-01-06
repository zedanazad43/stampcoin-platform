import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Coins, Image as ImageIcon, Calendar, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import './MintStamps.css';

interface Stamp {
  id: string;
  archiveId: string;
  country: string;
  denomination: number;
  year: number;
  catalog: string;
  condition: 'mint' | 'used' | 'fine' | 'very_fine';
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary';
  description: string;
  imageUrl: string;
  pricing: {
    baseValue: number;
    conditionMultiplier: number;
    rarityMultiplier: number;
    finalUSDValue: number;
    stampCoinValue: number;
  };
  serialNumber: string;
}

interface StampCollection {
  metadata: {
    exportDate: string;
    version: string;
    description: string;
  };
  statistics: {
    totalStamps: number;
    totalUSDValue: number;
    totalStampCoins: number;
    byRarity: Record<string, number>;
    byCountry: Record<string, number>;
  };
  stamps: Stamp[];
}

const rarityColors = {
  common: 'bg-gray-500',
  uncommon: 'bg-green-500',
  rare: 'bg-blue-500',
  very_rare: 'bg-purple-500',
  legendary: 'bg-amber-500',
};

const rarityLabels = {
  common: 'شائع',
  uncommon: 'غير شائع',
  rare: 'نادر',
  very_rare: 'نادر جداً',
  legendary: 'أسطوري',
};

export default function MintStamps() {
  const [selectedStamps, setSelectedStamps] = useState<Set<string>>(new Set());
  const [mintingStamps, setMintingStamps] = useState<Set<string>>(new Set());
  const [mintedStamps, setMintedStamps] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string>('all');
  const [stampCollection, setStampCollection] = useState<StampCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stamp collection from JSON export
  useEffect(() => {
    fetch('/stamp-collection-export.json')
      .then(res => res.json())
      .then(data => {
        setStampCollection(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to load stamp collection:', error);
        toast.error('فشل تحميل المجموعة', {
          description: 'حدث خطأ أثناء تحميل مجموعة الطوابع',
        });
        setIsLoading(false);
      });
  }, []);

  const mintMutation = {
    mutateAsync: async (variables: { archiveId: string; walletAddress: string }) => {
      // Simulate minting - in production this would call the smart contract
      return new Promise<{ serialNumber: string }>((resolve) => {
        setTimeout(() => {
          const stamp = stampCollection?.stamps.find(s => s.archiveId === variables.archiveId);
          resolve({ serialNumber: stamp?.serialNumber || 'STAMP-XXX-000000' });
        }, 2000);
      });
    },
  };

  const handleToggleSelect = (archiveId: string) => {
    setSelectedStamps(prev => {
      const next = new Set(prev);
      if (next.has(archiveId)) {
        next.delete(archiveId);
      } else {
        next.add(archiveId);
      }
      return next;
    });
  };

  const handleMintSingle = async (stamp: Stamp) => {
    setMintingStamps(prev => new Set(prev).add(stamp.archiveId));
    try {
      const result = await mintMutation.mutateAsync({
        archiveId: stamp.archiveId,
        walletAddress: '0x0000000000000000000000000000000000000000',
      });
      
      setMintedStamps(prev => new Set(prev).add(stamp.archiveId));
      setMintingStamps(prev => {
        const next = new Set(prev);
        next.delete(stamp.archiveId);
        return next;
      });
      setSelectedStamps(prev => {
        const next = new Set(prev);
        next.delete(stamp.archiveId);
        return next;
      });
      
      toast.success('تم سك NFT بنجاح', {
        description: `الرقم المتسلسل: ${result.serialNumber}`,
      });
    } catch (error) {
      setMintingStamps(prev => {
        const next = new Set(prev);
        next.delete(stamp.archiveId);
        return next;
      });
      toast.error('فشل سك NFT', {
        description: 'حدث خطأ أثناء السك',
      });
    }
  };

  const handleMintSelected = async () => {
    if (selectedStamps.size === 0) {
      toast.warning('لم يتم اختيار أي طوابع', {
        description: 'الرجاء اختيار طابع واحد على الأقل',
      });
      return;
    }

    const stamps = Array.from(selectedStamps);
    for (const archiveId of stamps) {
      const stamp = stampCollection?.stamps.find(s => s.archiveId === archiveId);
      if (stamp) {
        await handleMintSingle(stamp);
      }
    }
  };

  const filteredStamps = stampCollection?.stamps.filter(stamp => {
    if (filter === 'all') return true;
    return stamp.rarity === filter;
  }) || [];

  const stats = {
    total: stampCollection?.stamps.length || 0,
    selected: selectedStamps.size,
    minted: mintedStamps.size,
    totalValue: filteredStamps.reduce((sum, s) => sum + s.pricing.finalUSDValue, 0),
    totalStampCoins: filteredStamps.reduce((sum, s) => sum + s.pricing.stampCoinValue, 0),
  };

  if (isLoading) {
    return (
      <div className="mint-stamps-loading">
        <Loader2 className="animate-spin" size={48} />
        <p>جاري تحميل مجموعة الطوابع...</p>
      </div>
    );
  }

  return (
    <div className="mint-stamps-container">
      {/* Header */}
      <div className="mint-header">
        <div className="mint-header-content">
          <h1 className="mint-title">🏛️ سك الطوابع النادرة كـ NFTs</h1>
          <p className="mint-subtitle">
            حوّل الطوابع التاريخية الأصلية إلى رموز رقمية فريدة على البلوكتشين
          </p>
        </div>

        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-card">
            <ImageIcon className="stat-icon" />
            <div className="stat-info">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">إجمالي الطوابع</div>
            </div>
          </div>
          <div className="stat-card">
            <CheckCircle2 className="stat-icon selected" />
            <div className="stat-info">
              <div className="stat-value">{stats.selected}</div>
              <div className="stat-label">محدد للسك</div>
            </div>
          </div>
          <div className="stat-card">
            <Award className="stat-icon minted" />
            <div className="stat-info">
              <div className="stat-value">{stats.minted}</div>
              <div className="stat-label">تم السك</div>
            </div>
          </div>
          <div className="stat-card">
            <Coins className="stat-icon" />
            <div className="stat-info">
              <div className="stat-value">${stats.totalValue.toFixed(0)}</div>
              <div className="stat-label">القيمة الإجمالية</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mint-actions">
          <div className="filter-buttons">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              الكل ({stats.total})
            </Button>
            <Button
              variant={filter === 'legendary' ? 'default' : 'outline'}
              onClick={() => setFilter('legendary')}
            >
              أسطوري (3)
            </Button>
            <Button
              variant={filter === 'very_rare' ? 'default' : 'outline'}
              onClick={() => setFilter('very_rare')}
            >
              نادر جداً (9)
            </Button>
            <Button
              variant={filter === 'rare' ? 'default' : 'outline'}
              onClick={() => setFilter('rare')}
            >
              نادر (45)
            </Button>
            <Button
              variant={filter === 'uncommon' ? 'default' : 'outline'}
              onClick={() => setFilter('uncommon')}
            >
              غير شائع (24)
            </Button>
          </div>

          <Button
            size="lg"
            onClick={handleMintSelected}
            disabled={selectedStamps.size === 0 || mintingStamps.size > 0}
            className="mint-selected-btn"
          >
            {mintingStamps.size > 0 ? (
              <>
                <Loader2 className="animate-spin ml-2" size={20} />
                جاري السك...
              </>
            ) : (
              <>
                <Award className="ml-2" size={20} />
                سك المحدد ({selectedStamps.size})
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stamps Grid */}
      <div className="stamps-grid">
        {filteredStamps.map((stamp) => {
          const isSelected = selectedStamps.has(stamp.archiveId);
          const isMinting = mintingStamps.has(stamp.archiveId);
          const isMinted = mintedStamps.has(stamp.archiveId);

          return (
            <Card
              key={stamp.id}
              className={`stamp-card ${isSelected ? 'selected' : ''} ${isMinted ? 'minted' : ''}`}
              onClick={() => !isMinting && !isMinted && handleToggleSelect(stamp.archiveId)}
            >
              <CardHeader className="stamp-card-header">
                <div className="stamp-image-container">
                  <img
                    src={stamp.imageUrl}
                    alt={`${stamp.country} ${stamp.year}`}
                    className="stamp-image"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-stamp.png';
                    }}
                  />
                  {isMinted && (
                    <div className="minted-overlay">
                      <CheckCircle2 size={48} />
                      <span>تم السك</span>
                    </div>
                  )}
                  {isSelected && !isMinted && (
                    <div className="selected-overlay">
                      <CheckCircle2 size={32} />
                    </div>
                  )}
                </div>
                <Badge className={`rarity-badge ${rarityColors[stamp.rarity]}`}>
                  {rarityLabels[stamp.rarity]}
                </Badge>
              </CardHeader>

              <CardContent className="stamp-card-content">
                <CardTitle className="stamp-title">
                  {stamp.country} {stamp.year}
                </CardTitle>
                <CardDescription className="stamp-description">
                  {stamp.description.substring(0, 80)}...
                </CardDescription>

                <div className="stamp-details">
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span>{stamp.country}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>{stamp.year}</span>
                  </div>
                  <div className="detail-item">
                    <ImageIcon size={16} />
                    <span>{stamp.condition}</span>
                  </div>
                </div>

                <div className="stamp-pricing">
                  <div className="price-item">
                    <span className="price-label">القيمة:</span>
                    <span className="price-value usd">${stamp.pricing.finalUSDValue.toFixed(2)}</span>
                  </div>
                  <div className="price-item">
                    <span className="price-label">StampCoins:</span>
                    <span className="price-value stmp">{stamp.pricing.stampCoinValue.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="stamp-card-footer">
                <Button
                  className="mint-btn"
                  disabled={isMinting || isMinted}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMintSingle(stamp);
                  }}
                >
                  {isMinting ? (
                    <>
                      <Loader2 className="animate-spin ml-2" size={16} />
                      جاري السك...
                    </>
                  ) : isMinted ? (
                    <>
                      <CheckCircle2 className="ml-2" size={16} />
                      تم السك
                    </>
                  ) : (
                    <>
                      <Award className="ml-2" size={16} />
                      سك NFT
                    </>
                  )}
                </Button>
                <div className="serial-number">
                  {stamp.serialNumber}
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {filteredStamps.length === 0 && (
        <div className="empty-state">
          <ImageIcon size={64} />
          <h3>لا توجد طوابع متاحة</h3>
          <p>جرب تغيير الفلتر أو قم بتحميل المزيد من الطوابع</p>
        </div>
      )}
    </div>
  );
}
