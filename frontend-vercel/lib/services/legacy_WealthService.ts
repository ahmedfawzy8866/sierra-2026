// @ts-nocheck
/**
 * SIERRA ESTATES — WEALTH SERVICE BRIDGE
 * Orchestrates between raw Inventory and Neural Intelligence.
 */

import { IntelligentAsset } from '../models/intelligence';
import { InventoryService } from './InventoryService';
import { analyzeAssetFinancials } from './roi-service';
import { Unit, Property } from '@/lib/models/schema';

export const WealthService = {
  /**
   * Fetches the top curated assets and runs a neural ROI analysis on each.
   */
  async getCuratedPortfolio(count: number = 6, market?: 'egypt' | 'uae'): Promise<IntelligentAsset[]> {
    const rawAssets = await InventoryService.getFeaturedListings(count) as unknown as Property[];
    
    const enriched = await Promise.all(
      rawAssets.map(async (asset): Promise<IntelligentAsset> => {
        // Cast to Unit for ROI engine compatibility
        const unit: Unit = {
          id: asset.id,
          title: asset.title,
          price: asset.price,
          location: asset.location,
          propertyType: asset.propertyType as any,
          category: asset.category,
          market: asset.market,
          status: (asset.status as any) || 'available',
          finishingType: (asset.finishingType === 'fully-finished' || asset.finishingType === 'semi-finished' || asset.finishingType === 'core-shell') 
            ? asset.finishingType 
            : 'not-finished',
          area: asset.area,
          bedrooms: asset.bedrooms || 0,
          bathrooms: asset.bathrooms || 0,
          amenities: [],
          images: [],
          currency: asset.market === 'uae' ? 'AED' : 'EGP',
          ownerType: asset.ownerType || 'internal',
          pricePerSqm: asset.pricePerSqm || 0,
          compound: asset.compound || '',
          city: asset.city || ''
        };

        try {
          const financials = await analyzeAssetFinancials(unit);
          return {
            id: asset.id ?? '',
            title: asset.title ?? '',
            location: asset.location || '',
            price: asset.price,
            roi: financials.projectedROI,
            yield: financials.annualYield,
            intelligenceScore: Math.min(Math.round((financials.projectedROI + financials.annualYield * 2)), 100),
            reasoning: financials.valuationAnalysis,
            tags: asset.category === 'commercial' ? ['High Yield', 'Strategic'] : ['Premium', 'Luxury']
          };
        } catch (e) {
          console.error(`Wealth Intelligence failed for asset ${asset.id}`, e);
          return {
            id: asset.id ?? '',
            title: asset.title ?? '',
            location: asset.location || '',
            price: asset.price,
            roi: 0,
            yield: 0,
            intelligenceScore: 0,
            reasoning: "Intelligence analysis temporarily unavailable.",
            tags: []
          };
        }
      })
    );

    return enriched;
  }
};

