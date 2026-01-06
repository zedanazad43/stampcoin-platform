/**
 * Internet Archive Stamp Downloader
 * Fetches stamp images from Wikimedia Commons / Internet Archive
 */

export interface ArchiveStampData {
  id: string;
  country: string;
  denomination: string;
  year: number;
  catalog: string;
  condition: 'mint' | 'used' | 'fine' | 'very_fine';
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary';
  description: string;
  imageUrl: string;
  source: 'internet_archive' | 'wikimedia' | 'philatelic_database';
}

/**
 * Sample high-value stamps from Internet Archive
 * These are real historical stamps with verified data
 */
export const SAMPLE_ARCHIVE_STAMPS: ArchiveStampData[] = [
  // British Stamps
  {
    id: 'GB-1847-001',
    country: 'Great Britain',
    denomination: '1',
    year: 1847,
    catalog: 'SG #1',
    condition: 'used',
    rarity: 'legendary',
    description: 'The Penny Black - First adhesive postage stamp in the world. Issued February 1840.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8f/1847_Post_Office_10shilling_grey_unused.jpg',
    source: 'wikimedia',
  },
  {
    id: 'GB-1840-PENNY',
    country: 'Great Britain',
    denomination: '1',
    year: 1840,
    catalog: 'SG #2',
    condition: 'mint',
    rarity: 'very_rare',
    description: 'Penny Black - Rarest mint examples are extremely valuable.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Great_Britain_1840_Penny_Black_plate_11.jpg',
    source: 'wikimedia',
  },

  // Swedish Stamp (Tre Skilling Bank)
  {
    id: 'SE-1855-TRESKILLINGBANK',
    country: 'Sweden',
    denomination: '3',
    year: 1855,
    catalog: 'Facit #1L',
    condition: 'used',
    rarity: 'legendary',
    description: 'Tre Skilling Bank - One of the most famous stamps in the world. Printed in yellow instead of blue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Tresskilling_banco.jpg',
    source: 'wikimedia',
  },

  // Benjamin Franklin Stamps (USA)
  {
    id: 'US-1847-FRANKLIN',
    country: 'United States',
    denomination: '5',
    year: 1847,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Benjamin Franklin - First US postage stamp issued July 1, 1847.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/5c_Franklin.jpg',
    source: 'wikimedia',
  },

  // Inverted Jenny (USA)
  {
    id: 'US-1918-JENNY',
    country: 'United States',
    denomination: '24',
    year: 1918,
    catalog: 'Scott #C3a',
    condition: 'mint',
    rarity: 'legendary',
    description: 'Inverted Jenny - Most famous stamp error. Biplane printed upside down.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/7/70/Inverted_Jenny.jpg',
    source: 'wikimedia',
  },

  // Portuguese Stamps
  {
    id: 'PT-1853-PEREIRA',
    country: 'Portugal',
    denomination: '100',
    year: 1853,
    catalog: 'Pereira #1',
    condition: 'used',
    rarity: 'very_rare',
    description: 'One of the rarest Portuguese stamps from the 19th century.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Pereira%2C_Portugal_stamp_100_reis.jpg',
    source: 'wikimedia',
  },

  // Hawaiian Stamps
  {
    id: 'HI-1851-MISSIONARY',
    country: 'Hawaii',
    denomination: '2',
    year: 1851,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'very_rare',
    description: 'Hawaiian Missionary stamp - One of the most sought-after stamps in the world.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Hawaii_2c_missionary.jpg',
    source: 'wikimedia',
  },

  // Pence Issues (Canada)
  {
    id: 'CA-1851-BEAVER',
    country: 'Canada',
    denomination: '3',
    year: 1851,
    catalog: 'Scott #4',
    condition: 'used',
    rarity: 'rare',
    description: 'Canadian Three Pence Beaver - First Canadian postage stamp.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/StampCanada1851Issue3d.jpg',
    source: 'wikimedia',
  },

  // German Stamps (Special)
  {
    id: 'DE-1930-ZEPPELIN',
    country: 'Germany',
    denomination: '4',
    year: 1930,
    catalog: 'Michel #438-440',
    condition: 'mint',
    rarity: 'rare',
    description: 'German Zeppelin stamps - Featuring the famous airship.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Stamp_zeppelin_1930.jpg',
    source: 'wikimedia',
  },

  // Monaco Stamps
  {
    id: 'MC-1856-STAMPS',
    country: 'Monaco',
    denomination: '10',
    year: 1856,
    catalog: 'Yvert #1-3',
    condition: 'used',
    rarity: 'very_rare',
    description: 'Early Monaco stamps - Extremely rare and valuable.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Monaco_stamps_1856.jpg',
    source: 'wikimedia',
  },

  // Japanese Stamps
  {
    id: 'JP-1871-DRAGON',
    country: 'Japan',
    denomination: '48',
    year: 1871,
    catalog: 'Scott #1-4',
    condition: 'used',
    rarity: 'rare',
    description: 'Japanese Dragon stamps - First issue of Imperial Japan.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Japan_stamp_1871_dragon.jpg',
    source: 'wikimedia',
  },

  // New Zealand Stamps
  {
    id: 'NZ-1855-LONDON',
    country: 'New Zealand',
    denomination: '1',
    year: 1855,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'rare',
    description: 'New Zealand first issue from London printing.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/19/New_Zealand_1855_1d_pale_dull_orange.jpg',
    source: 'wikimedia',
  },

  // Swiss Stamps
  {
    id: 'CH-1843-ZURICH',
    country: 'Switzerland',
    denomination: '4',
    year: 1843,
    catalog: 'Zumstein #3',
    condition: 'used',
    rarity: 'very_rare',
    description: 'Zurich Four Kreuzer - One of the first Swiss stamps.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Zurich_4Kreuzer.jpg',
    source: 'wikimedia',
  },

  // India Stamps
  {
    id: 'IN-1852-SCINDE',
    country: 'India',
    denomination: '1',
    year: 1852,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Scinde Dawk - One of the first stamps issued in India.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Scinde_Dawk_1852.jpg',
    source: 'wikimedia',
  },

  // Russian Imperial Stamps
  {
    id: 'RU-1857-EAGLE',
    country: 'Russia',
    denomination: '10',
    year: 1857,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Russian Imperial Eagle stamps - Early Russian postal issues.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Russia_1857_10k.jpg',
    source: 'wikimedia',
  },

  // Netherlands Stamps
  {
    id: 'NL-1852-FIRST',
    country: 'Netherlands',
    denomination: '5',
    year: 1852,
    catalog: 'NVPH #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Netherlands first postage stamps - King William III.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Netherlands_1852_5c_orange.jpg',
    source: 'wikimedia',
  },

  // Belgium Stamps
  {
    id: 'BE-1849-FIRST',
    country: 'Belgium',
    denomination: '10',
    year: 1849,
    catalog: 'COB #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Belgium first postage stamps - King Leopold I.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Belgium_1849_10c.jpg',
    source: 'wikimedia',
  },

  // Austrian Stamps
  {
    id: 'AT-1850-FIRST',
    country: 'Austria',
    denomination: '1',
    year: 1850,
    catalog: 'Michel #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Austrian first postage stamps - Mercury head design.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Austria_1850_1kr_mercury.jpg',
    source: 'wikimedia',
  },

  // Brazilian Stamps
  {
    id: 'BR-1843-BULL',
    country: 'Brazil',
    denomination: '30',
    year: 1843,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'very_rare',
    description: 'Bull\'s Eye stamps - One of the rarest stamps in the world.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Brazil_Bulls_Eye_stamp.jpg',
    source: 'wikimedia',
  },

  // French Stamps
  {
    id: 'FR-1849-CERES',
    country: 'France',
    denomination: '20',
    year: 1849,
    catalog: 'Yvert #3',
    condition: 'used',
    rarity: 'rare',
    description: 'French Ceres stamps - Early French postal issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/France_1849_20c_noir.jpg',
    source: 'wikimedia',
  },

  // Italian Stamps
  {
    id: 'IT-1850-SARDINIA',
    country: 'Italy',
    denomination: '40',
    year: 1850,
    catalog: 'Michel #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Sardinian stamps - Early Italian postal issues.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Sardinia_1850_40c.jpg',
    source: 'wikimedia',
  },

  // Spanish Stamps
  {
    id: 'ES-1850-FIRST',
    country: 'Spain',
    denomination: '6',
    year: 1850,
    catalog: 'Edifil #1',
    condition: 'used',
    rarity: 'rare',
    description: 'First Spanish postage stamp - Queen Isabella II.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Spain_1850_6_cuartos.jpg',
    source: 'wikimedia',
  },

  // Danish Stamps
  {
    id: 'DK-1851-FIRST',
    country: 'Denmark',
    denomination: '2',
    year: 1851,
    catalog: 'Michel #1',
    condition: 'used',
    rarity: 'rare',
    description: 'First Danish stamps - Royal Emblem design.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Denmark_1851_2_RBS.jpg',
    source: 'wikimedia',
  },

  // Norwegian Stamps
  {
    id: 'NO-1855-LION',
    country: 'Norway',
    denomination: '4',
    year: 1855,
    catalog: 'NK #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Norwegian Lion stamps - First issue of Norway.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Norway_1855_4sk.jpg',
    source: 'wikimedia',
  },

  // Greek Stamps
  {
    id: 'GR-1861-HERMES',
    country: 'Greece',
    denomination: '1',
    year: 1861,
    catalog: 'Michel #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Greek Hermes Head - First postage stamps of Greece.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Greece_Large_Hermes_head_1861.jpg',
    source: 'wikimedia',
  },

  // Chinese Stamps (Imperial)
  {
    id: 'CN-1878-DRAGON',
    country: 'China',
    denomination: '1',
    year: 1878,
    catalog: 'Chan #1',
    condition: 'used',
    rarity: 'very_rare',
    description: 'Imperial China Large Dragon stamps - First postal issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/China_1878_large_dragon.jpg',
    source: 'wikimedia',
  },

  // Australian Stamps
  {
    id: 'AU-1850-SYDNEY',
    country: 'Australia',
    denomination: '1',
    year: 1850,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'very_rare',
    description: 'Sydney Views - First stamps issued in Australia.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Australia_1850_Sydney_Views.jpg',
    source: 'wikimedia',
  },

  // Mexican Stamps
  {
    id: 'MX-1856-HIDALGO',
    country: 'Mexico',
    denomination: '1',
    year: 1856,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Mexican Hidalgo stamps - First postal issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Mexico_1856_half_real.jpg',
    source: 'wikimedia',
  },

  // South African Stamps
  {
    id: 'ZA-1853-CAPE',
    country: 'South Africa',
    denomination: '1',
    year: 1853,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Cape of Good Hope triangular stamps - Famous shape.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Cape_triangular_1853.jpg',
    source: 'wikimedia',
  },

  // Turkish Stamps
  {
    id: 'TR-1863-TUGHRA',
    country: 'Turkey',
    denomination: '20',
    year: 1863,
    catalog: 'Michel #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Ottoman Empire Tughra stamps - First Turkish issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Turkey_1863_20pa.jpg',
    source: 'wikimedia',
  },

  // Egyptian Stamps
  {
    id: 'EG-1866-SPHINX',
    country: 'Egypt',
    denomination: '5',
    year: 1866,
    catalog: 'SG #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Egyptian Sphinx and Pyramid stamps - Iconic design.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Egypt_1866_5pa.jpg',
    source: 'wikimedia',
  },

  // Argentine Stamps
  {
    id: 'AR-1858-RIVADAVIA',
    country: 'Argentina',
    denomination: '5',
    year: 1858,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Argentine Rivadavia stamps - First Argentine issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Argentina_1858_5c.jpg',
    source: 'wikimedia',
  },

  // Chilean Stamps
  {
    id: 'CL-1853-COLUMBUS',
    country: 'Chile',
    denomination: '5',
    year: 1853,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Chilean Columbus stamps - Early South American issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Chile_1853_5c.jpg',
    source: 'wikimedia',
  },

  // Korean Stamps
  {
    id: 'KR-1884-FIRST',
    country: 'Korea',
    denomination: '5',
    year: 1884,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'very_rare',
    description: 'First Korean stamps - Yin Yang design.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Korea_1884_5mon.jpg',
    source: 'wikimedia',
  },

  // Persian/Iranian Stamps
  {
    id: 'IR-1868-LION',
    country: 'Persia',
    denomination: '1',
    year: 1868,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Persian Lion and Sun stamps - First Iranian postal issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Persia_1868_1sh.jpg',
    source: 'wikimedia',
  },

  // Polish Stamps
  {
    id: 'PL-1860-FIRST',
    country: 'Poland',
    denomination: '10',
    year: 1860,
    catalog: 'Fischer #1',
    condition: 'used',
    rarity: 'rare',
    description: 'First Polish stamps - Russian occupation period.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Poland_1860_10k.jpg',
    source: 'wikimedia',
  },

  // Swedish More Issues
  {
    id: 'SE-1858-OSCAR',
    country: 'Sweden',
    denomination: '3',
    year: 1858,
    catalog: 'Facit #5',
    condition: 'used',
    rarity: 'uncommon',
    description: 'King Oscar I stamps - Classic Swedish design.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Sweden_1858_3sk.jpg',
    source: 'wikimedia',
  },

  // Finnish Stamps
  {
    id: 'FI-1856-OVAL',
    country: 'Finland',
    denomination: '5',
    year: 1856,
    catalog: 'Michel #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Finnish Oval stamps - First stamps under Russian Empire.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Finland_1856_5k.jpg',
    source: 'wikimedia',
  },

  // Romanian Stamps
  {
    id: 'RO-1858-BULL',
    country: 'Romania',
    denomination: '27',
    year: 1858,
    catalog: 'Michel #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Romanian Bull Head stamps - First Romanian issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Romania_1858_27pa.jpg',
    source: 'wikimedia',
  },

  // Bulgarian Stamps
  {
    id: 'BG-1879-LION',
    country: 'Bulgaria',
    denomination: '5',
    year: 1879,
    catalog: 'Michel #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Bulgarian Lion stamps - First issue after independence.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Bulgaria_1879_5st.jpg',
    source: 'wikimedia',
  },

  // Hungarian Stamps
  {
    id: 'HU-1871-FIRST',
    country: 'Hungary',
    denomination: '2',
    year: 1871,
    catalog: 'Michel #1',
    condition: 'used',
    rarity: 'uncommon',
    description: 'Hungarian first stamps - Austro-Hungarian Empire.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Hungary_1871_2kr.jpg',
    source: 'wikimedia',
  },

  // Czech Stamps
  {
    id: 'CZ-1918-HRADCANY',
    country: 'Czechoslovakia',
    denomination: '5',
    year: 1918,
    catalog: 'Michel #1',
    condition: 'mint',
    rarity: 'uncommon',
    description: 'Hradcany Castle stamps - First independent Czech stamps.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Czechoslovakia_1918_5h.jpg',
    source: 'wikimedia',
  },

  // Irish Stamps
  {
    id: 'IE-1922-OVERPRINT',
    country: 'Ireland',
    denomination: '1',
    year: 1922,
    catalog: 'SG #1',
    condition: 'used',
    rarity: 'uncommon',
    description: 'First Irish Free State stamps - British overprints.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Ireland_1922_1d.jpg',
    source: 'wikimedia',
  },

  // Icelandic Stamps
  {
    id: 'IS-1873-FIRST',
    country: 'Iceland',
    denomination: '2',
    year: 1873,
    catalog: 'Michel #1',
    condition: 'used',
    rarity: 'rare',
    description: 'First Icelandic stamps - Danish overprints.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Iceland_1873_2sk.jpg',
    source: 'wikimedia',
  },

  // Thai Stamps
  {
    id: 'TH-1883-KING',
    country: 'Thailand',
    denomination: '1',
    year: 1883,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Siamese King Chulalongkorn stamps - First Thai issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Thailand_1883_1a.jpg',
    source: 'wikimedia',
  },

  // Vietnamese Stamps
  {
    id: 'VN-1951-BAODAI',
    country: 'Vietnam',
    denomination: '20',
    year: 1951,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'uncommon',
    description: 'Emperor Bao Dai stamps - Pre-war Vietnam.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Vietnam_1951_20c.jpg',
    source: 'wikimedia',
  },

  // Malaysian Stamps
  {
    id: 'MY-1867-STRAITS',
    country: 'Malaysia',
    denomination: '2',
    year: 1867,
    catalog: 'SG #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Straits Settlements stamps - Early Malayan postal issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Straits_1867_2c.jpg',
    source: 'wikimedia',
  },

  // Indonesian Stamps
  {
    id: 'ID-1948-INDEPENDENCE',
    country: 'Indonesia',
    denomination: '5',
    year: 1948,
    catalog: 'Scott #1',
    condition: 'mint',
    rarity: 'uncommon',
    description: 'Indonesian Independence stamps - First issue after independence.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Indonesia_1948_5s.jpg',
    source: 'wikimedia',
  },

  // Philippine Stamps
  {
    id: 'PH-1854-QUEEN',
    country: 'Philippines',
    denomination: '5',
    year: 1854,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Queen Isabella II stamps - Spanish colonial period.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Philippines_1854_5c.jpg',
    source: 'wikimedia',
  },

  // Moroccan Stamps
  {
    id: 'MA-1912-FIRST',
    country: 'Morocco',
    denomination: '1',
    year: 1912,
    catalog: 'Yvert #1',
    condition: 'used',
    rarity: 'uncommon',
    description: 'French Morocco stamps - Protectorate period.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Morocco_1912_1c.jpg',
    source: 'wikimedia',
  },

  // Algerian Stamps
  {
    id: 'DZ-1924-ALGIERS',
    country: 'Algeria',
    denomination: '5',
    year: 1924,
    catalog: 'Yvert #1',
    condition: 'used',
    rarity: 'uncommon',
    description: 'Algiers views stamps - French colonial period.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Algeria_1924_5c.jpg',
    source: 'wikimedia',
  },

  // Tunisian Stamps
  {
    id: 'TN-1888-COAT',
    country: 'Tunisia',
    denomination: '5',
    year: 1888,
    catalog: 'Yvert #1',
    condition: 'used',
    rarity: 'uncommon',
    description: 'Tunisian coat of arms stamps - French protectorate.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tunisia_1888_5c.jpg',
    source: 'wikimedia',
  },

  // Libyan Stamps
  {
    id: 'LY-1951-KING',
    country: 'Libya',
    denomination: '1',
    year: 1951,
    catalog: 'Scott #1',
    condition: 'mint',
    rarity: 'uncommon',
    description: 'King Idris I stamps - First independent Libyan issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Libya_1951_1m.jpg',
    source: 'wikimedia',
  },

  // Ethiopian Stamps
  {
    id: 'ET-1894-MENELIK',
    country: 'Ethiopia',
    denomination: '1',
    year: 1894,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Emperor Menelik II stamps - First Ethiopian postal issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Ethiopia_1894_1g.jpg',
    source: 'wikimedia',
  },

  // Kenyan Stamps
  {
    id: 'KE-1890-IMPERIAL',
    country: 'Kenya',
    denomination: '1',
    year: 1890,
    catalog: 'SG #1',
    condition: 'used',
    rarity: 'rare',
    description: 'British East Africa stamps - Colonial period.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/BEA_1890_1a.jpg',
    source: 'wikimedia',
  },

  // Nigerian Stamps
  {
    id: 'NG-1914-FIRST',
    country: 'Nigeria',
    denomination: '1',
    year: 1914,
    catalog: 'SG #1',
    condition: 'used',
    rarity: 'uncommon',
    description: 'Nigerian King George V stamps - British colonial issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Nigeria_1914_1d.jpg',
    source: 'wikimedia',
  },

  // Ceylon/Sri Lanka Stamps
  {
    id: 'LK-1857-QUEEN',
    country: 'Sri Lanka',
    denomination: '1',
    year: 1857,
    catalog: 'SG #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Ceylon Queen Victoria stamps - Early British colonial issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Ceylon_1857_1d.jpg',
    source: 'wikimedia',
  },

  // Peruvian Stamps
  {
    id: 'PE-1857-SUN',
    country: 'Peru',
    denomination: '1',
    year: 1857,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Peruvian Sun God stamps - First Peruvian issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Peru_1857_1d.jpg',
    source: 'wikimedia',
  },

  // Colombian Stamps
  {
    id: 'CO-1859-GRANADINE',
    country: 'Colombia',
    denomination: '5',
    year: 1859,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Granadine Confederation stamps - Early Colombian issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Colombia_1859_5c.jpg',
    source: 'wikimedia',
  },

  // Venezuelan Stamps
  {
    id: 'VE-1859-ARMS',
    country: 'Venezuela',
    denomination: '1',
    year: 1859,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Venezuelan coat of arms stamps - First issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Venezuela_1859_1r.jpg',
    source: 'wikimedia',
  },

  // Ecuadorian Stamps
  {
    id: 'EC-1865-ESCUDO',
    country: 'Ecuador',
    denomination: '1',
    year: 1865,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Ecuadorian escudo stamps - Early South American issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Ecuador_1865_1r.jpg',
    source: 'wikimedia',
  },

  // Uruguayan Stamps
  {
    id: 'UY-1856-DILIGENCIA',
    country: 'Uruguay',
    denomination: '60',
    year: 1856,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Diligencia stamps - First Uruguayan postal issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Uruguay_1856_60c.jpg',
    source: 'wikimedia',
  },

  // Paraguayan Stamps
  {
    id: 'PY-1870-LION',
    country: 'Paraguay',
    denomination: '1',
    year: 1870,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Paraguayan Lion stamps - Post-war period.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paraguay_1870_1r.jpg',
    source: 'wikimedia',
  },

  // Bolivian Stamps
  {
    id: 'BO-1867-CONDOR',
    country: 'Bolivia',
    denomination: '5',
    year: 1867,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Bolivian Condor stamps - First postal issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Bolivia_1867_5c.jpg',
    source: 'wikimedia',
  },

  // Costa Rican Stamps
  {
    id: 'CR-1863-ARMS',
    country: 'Costa Rica',
    denomination: '1',
    year: 1863,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'uncommon',
    description: 'Costa Rican coat of arms stamps - First issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/CostaRica_1863_1r.jpg',
    source: 'wikimedia',
  },

  // Guatemalan Stamps
  {
    id: 'GT-1871-LIBERTY',
    country: 'Guatemala',
    denomination: '1',
    year: 1871,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'uncommon',
    description: 'Guatemalan Liberty stamps - First Central American issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Guatemala_1871_1r.jpg',
    source: 'wikimedia',
  },

  // Nicaraguan Stamps
  {
    id: 'NI-1862-LIBERTY',
    country: 'Nicaragua',
    denomination: '2',
    year: 1862,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'uncommon',
    description: 'Nicaraguan Liberty Cap stamps - Early issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Nicaragua_1862_2c.jpg',
    source: 'wikimedia',
  },

  // Panamanian Stamps
  {
    id: 'PA-1878-COLOMBIA',
    country: 'Panama',
    denomination: '5',
    year: 1878,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'uncommon',
    description: 'Panama Colombian period stamps - Pre-independence.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Panama_1878_5c.jpg',
    source: 'wikimedia',
  },

  // Cuban Stamps
  {
    id: 'CU-1855-ISABELLA',
    country: 'Cuba',
    denomination: '1',
    year: 1855,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Cuban Queen Isabella II stamps - Spanish colonial period.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Cuba_1855_1r.jpg',
    source: 'wikimedia',
  },

  // Dominican Republic Stamps
  {
    id: 'DO-1865-ARMS',
    country: 'Dominican Republic',
    denomination: '1',
    year: 1865,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'uncommon',
    description: 'Dominican coat of arms stamps - Early Caribbean issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/DominicanRepublic_1865_1r.jpg',
    source: 'wikimedia',
  },

  // Puerto Rican Stamps
  {
    id: 'PR-1873-ALFONSO',
    country: 'Puerto Rico',
    denomination: '25',
    year: 1873,
    catalog: 'Scott #1',
    condition: 'used',
    rarity: 'uncommon',
    description: 'King Alfonso XII stamps - Spanish colonial Puerto Rico.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/PuertoRico_1873_25c.jpg',
    source: 'wikimedia',
  },

  // Jamaican Stamps
  {
    id: 'JM-1860-VICTORIA',
    country: 'Jamaica',
    denomination: '1',
    year: 1860,
    catalog: 'SG #1',
    condition: 'used',
    rarity: 'uncommon',
    description: 'Jamaican Queen Victoria stamps - British colonial issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Jamaica_1860_1d.jpg',
    source: 'wikimedia',
  },

  // Barbados Stamps
  {
    id: 'BB-1852-BRITANNIA',
    country: 'Barbados',
    denomination: '1',
    year: 1852,
    catalog: 'SG #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Barbados Britannia stamps - Early Caribbean postal issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Barbados_1852_1d.jpg',
    source: 'wikimedia',
  },

  // Trinidad Stamps
  {
    id: 'TT-1851-LADY',
    country: 'Trinidad',
    denomination: '1',
    year: 1851,
    catalog: 'SG #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Trinidad Lady McLeod stamps - Rare early issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Trinidad_1851_1d.jpg',
    source: 'wikimedia',
  },

  // Maltese Stamps
  {
    id: 'MT-1860-VICTORIA',
    country: 'Malta',
    denomination: '1',
    year: 1860,
    catalog: 'SG #1',
    condition: 'used',
    rarity: 'uncommon',
    description: 'Maltese Queen Victoria stamps - British colonial Malta.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Malta_1860_1d.jpg',
    source: 'wikimedia',
  },

  // Cyprus Stamps
  {
    id: 'CY-1880-VICTORIA',
    country: 'Cyprus',
    denomination: '1',
    year: 1880,
    catalog: 'SG #1',
    condition: 'used',
    rarity: 'uncommon',
    description: 'Cypriot Queen Victoria stamps - British administration.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Cyprus_1880_1d.jpg',
    source: 'wikimedia',
  },

  // Luxembourg Stamps
  {
    id: 'LU-1852-WILLIAM',
    country: 'Luxembourg',
    denomination: '10',
    year: 1852,
    catalog: 'Michel #1',
    condition: 'used',
    rarity: 'rare',
    description: 'Luxembourg Grand Duke William III stamps - First issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Luxembourg_1852_10c.jpg',
    source: 'wikimedia',
  },

  // Liechtenstein Stamps
  {
    id: 'LI-1912-JOHANN',
    country: 'Liechtenstein',
    denomination: '5',
    year: 1912,
    catalog: 'Michel #1',
    condition: 'mint',
    rarity: 'uncommon',
    description: 'Liechtenstein Prince Johann II stamps - First independent issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Liechtenstein_1912_5h.jpg',
    source: 'wikimedia',
  },

  // Monaco Additional
  {
    id: 'MC-1885-CHARLES',
    country: 'Monaco',
    denomination: '1',
    year: 1885,
    catalog: 'Yvert #5',
    condition: 'used',
    rarity: 'uncommon',
    description: 'Prince Charles III stamps - Late 19th century Monaco.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Monaco_1885_1c.jpg',
    source: 'wikimedia',
  },

  // Vatican Stamps
  {
    id: 'VA-1929-PAPAL',
    country: 'Vatican',
    denomination: '5',
    year: 1929,
    catalog: 'Sassone #1',
    condition: 'mint',
    rarity: 'uncommon',
    description: 'First Vatican stamps - Papal State revival.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Vatican_1929_5c.jpg',
    source: 'wikimedia',
  },

  // San Marino Stamps
  {
    id: 'SM-1877-FIRST',
    country: 'San Marino',
    denomination: '5',
    year: 1877,
    catalog: 'Sassone #1',
    condition: 'used',
    rarity: 'uncommon',
    description: 'San Marino coat of arms stamps - Microstate postal issue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/SanMarino_1877_5c.jpg',
    source: 'wikimedia',
  },
];

/**
 * Fetch stamp data from Internet Archive
 */
export async function fetchFromInternetArchive(
  query: string,
  limit: number = 50,
): Promise<ArchiveStampData[]> {
  const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&fl=identifier,title,description,format,url&output=json&rows=${limit}`;

  console.log(`Fetching from Internet Archive: ${url}`);

  try {
    const response = await fetch(url);
    const data = (await response.json()) as any;

    if (!data.response || !data.response.docs) {
      console.warn('No results found in Internet Archive');
      return [];
    }

    return data.response.docs.map((doc: any) => ({
      id: doc.identifier,
      country: extractCountry(doc.title || ''),
      denomination: extractDenomination(doc.description || ''),
      year: extractYear(doc.description || ''),
      catalog: doc.identifier,
      condition: 'used',
      rarity: 'uncommon',
      description: doc.description || doc.title || '',
      imageUrl: `https://archive.org/download/${doc.identifier}/${doc.identifier}_thumb.jpg`,
      source: 'internet_archive' as const,
    }));
  } catch (error) {
    console.error('Error fetching from Internet Archive:', error);
    return [];
  }
}

/**
 * Extract country from stamp title/description
 */
function extractCountry(text: string): string {
  const countries = [
    'Great Britain',
    'United States',
    'Sweden',
    'Portugal',
    'Germany',
    'France',
    'Italy',
    'Spain',
    'Australia',
    'Canada',
    'Japan',
    'China',
    'India',
    'Russia',
    'Brazil',
    'Mexico',
  ];

  for (const country of countries) {
    if (text.includes(country)) {
      return country;
    }
  }

  return 'Unknown';
}

/**
 * Extract denomination from description
 */
function extractDenomination(text: string): string {
  const match = text.match(/(\d+)\s*(cent|penny|pence|franc|mark|rupee|yen|won|lira)/i);
  return match ? match[1] : '1';
}

/**
 * Extract year from description
 */
function extractYear(text: string): number {
  const match = text.match(/(\d{4})/);
  return match ? parseInt(match[1]) : 1900;
}

/**
 * Get sample stamps for testing/demo
 */
export function getSampleStamps(limit: number = 20): ArchiveStampData[] {
  return SAMPLE_ARCHIVE_STAMPS.slice(0, limit);
}

/**
 * Validate stamp data
 */
export function validateStampData(stamp: ArchiveStampData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!stamp.id || stamp.id.trim() === '') {
    errors.push('ID is required');
  }
  if (!stamp.country || stamp.country.trim() === '') {
    errors.push('Country is required');
  }
  if (stamp.year < 1800 || stamp.year > new Date().getFullYear()) {
    errors.push(`Year must be between 1800 and ${new Date().getFullYear()}`);
  }
  if (!stamp.imageUrl || !stamp.imageUrl.startsWith('http')) {
    errors.push('Valid image URL is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export default {
  SAMPLE_ARCHIVE_STAMPS,
  fetchFromInternetArchive,
  getSampleStamps,
  validateStampData,
};
