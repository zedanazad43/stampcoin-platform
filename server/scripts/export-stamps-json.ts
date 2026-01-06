#!/usr/bin/env node

/**
 * Export Stamp Collection to JSON
 * Usage: npm run export:stamps
 */

import * as archiveDownloader from '../archive-downloader';
import * as archiveService from '../stamp-archive';
import * as fs from 'fs';
import * as path from 'path';

interface StampExport {
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

async function exportStamps() {
  console.log('📦 Exporting Stamp Collection...\n');

  try {
    // Get all stamps
    console.log('📚 Loading stamp collection...');
    const stamps = archiveDownloader.getSampleStamps(100);
    console.log(`✅ Loaded ${stamps.length} stamps\n`);

    // Validate stamps
    console.log('🔍 Validating stamp data...');
    const validStamps = stamps.filter((stamp) => {
      const validation = archiveDownloader.validateStampData(stamp);
      if (!validation.valid) {
        console.warn(`⚠️  ${stamp.id}: ${validation.errors.join(', ')}`);
      }
      return validation.valid;
    });
    console.log(`✅ ${validStamps.length}/${stamps.length} stamps validated\n`);

    // Process and export stamps
    console.log('💰 Calculating pricing...');
    const exportData: StampExport[] = validStamps.map((stamp, index) => {
      const metadata = {
        archiveId: stamp.id,
        country: stamp.country,
        denomination: parseInt(stamp.denomination) || 1,
        year: stamp.year,
        catalog: stamp.catalog,
        condition: stamp.condition,
        rarity: stamp.rarity,
        description: stamp.description,
        imageUrl: stamp.imageUrl,
      };

      const pricing = archiveService.calculateStampValue(metadata);
      const serialNumber = archiveService.generateSerialNumber(stamp.id, index + 1);

      return {
        id: `STAMP_${index + 1}`.padStart(10, '0'),
        archiveId: stamp.id,
        country: stamp.country,
        denomination: parseInt(stamp.denomination) || 1,
        year: stamp.year,
        catalog: stamp.catalog,
        condition: stamp.condition,
        rarity: stamp.rarity,
        description: stamp.description,
        imageUrl: stamp.imageUrl,
        pricing: {
          baseValue: pricing.baseValue,
          conditionMultiplier: pricing.condition_multiplier,
          rarityMultiplier: pricing.rarity_multiplier,
          finalUSDValue: pricing.final_value,
          stampCoinValue: pricing.currency,
        },
        serialNumber,
      };
    });

    // Generate statistics
    const stats = {
      totalStamps: exportData.length,
      totalUSDValue: exportData.reduce((sum, s) => sum + s.pricing.finalUSDValue, 0),
      totalStampCoins: exportData.reduce((sum, s) => sum + s.pricing.stampCoinValue, 0),
      byRarity: {} as Record<string, number>,
      byCountry: {} as Record<string, number>,
      byCondition: {} as Record<string, number>,
      yearRange: {
        oldest: Math.min(...exportData.map(s => s.year)),
        newest: Math.max(...exportData.map(s => s.year)),
      },
    };

    exportData.forEach(stamp => {
      stats.byRarity[stamp.rarity] = (stats.byRarity[stamp.rarity] || 0) + 1;
      stats.byCountry[stamp.country] = (stats.byCountry[stamp.country] || 0) + 1;
      stats.byCondition[stamp.condition] = (stats.byCondition[stamp.condition] || 0) + 1;
    });

    // Create export object
    const exportObj = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0.0',
        description: 'StampCoin Platform - Complete Stamp Archive Collection',
      },
      statistics: stats,
      stamps: exportData,
    };

    // Write to JSON file
    const outputPath = path.join(process.cwd(), 'stamp-collection-export.json');
    fs.writeFileSync(outputPath, JSON.stringify(exportObj, null, 2));
    console.log(`✅ Exported to: ${outputPath}\n`);

    // Display summary
    console.log('📊 Export Summary:');
    console.log(`  Total Stamps: ${stats.totalStamps}`);
    console.log(`  Total USD Value: $${stats.totalUSDValue.toFixed(2)}`);
    console.log(`  Total StampCoins: ${stats.totalStampCoins.toLocaleString()}`);
    console.log(`  Year Range: ${stats.yearRange.oldest} - ${stats.yearRange.newest}\n`);

    console.log('📊 By Rarity:');
    Object.entries(stats.byRarity)
      .sort(([,a], [,b]) => b - a)
      .forEach(([rarity, count]) => {
        const stamps = exportData.filter(s => s.rarity === rarity);
        const avgValue = stamps.reduce((sum, s) => sum + s.pricing.finalUSDValue, 0) / stamps.length;
        console.log(`  ${rarity.padEnd(12)}: ${count} stamps, avg $${avgValue.toFixed(2)}`);
      });

    console.log('\n📍 By Country (Top 10):');
    Object.entries(stats.byCountry)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([country, count]) => {
        const stamps = exportData.filter(s => s.country === country);
        const totalValue = stamps.reduce((sum, s) => sum + s.pricing.finalUSDValue, 0);
        console.log(`  ${country.padEnd(20)}: ${count} stamps, $${totalValue.toFixed(2)}`);
      });

    console.log('\n🎯 By Condition:');
    Object.entries(stats.byCondition)
      .forEach(([condition, count]) => {
        console.log(`  ${condition.padEnd(12)}: ${count} stamps`);
      });

    console.log('\n💎 Most Valuable Stamps (Top 5):');
    exportData
      .sort((a, b) => b.pricing.finalUSDValue - a.pricing.finalUSDValue)
      .slice(0, 5)
      .forEach((stamp, i) => {
        console.log(`  ${i + 1}. ${stamp.country} ${stamp.denomination} (${stamp.year})`);
        console.log(`     ${stamp.rarity} - ${stamp.condition}`);
        console.log(`     $${stamp.pricing.finalUSDValue.toFixed(2)} = ${stamp.pricing.stampCoinValue.toLocaleString()} STMP`);
      });

    console.log('\n✅ Export complete! 🎉\n');

  } catch (error) {
    console.error('❌ Error exporting stamps:', error);
    process.exit(1);
  }
}

// Run export
exportStamps().catch(console.error);
