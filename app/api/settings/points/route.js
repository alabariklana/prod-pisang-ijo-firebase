import { ApiResponse, handleApiError, validateRequiredFields } from '@/lib/api-utils';
import { withDatabase } from '@/lib/mongodb';
import { businessSettings } from '@/lib/config';

/**
 * Get default points settings
 * @returns {Object} Default points settings
 */
function getDefaultPointsSettings() {
  return {
    type: 'points',
    pointsPerPurchase: businessSettings.pointsPerPurchase,
    minimumPurchaseForPoints: businessSettings.minimumPurchaseForPoints,
    pointsToRupiah: businessSettings.pointsToRupiah,
    minimumRedeemPoints: businessSettings.minimumRedeemPoints,
    isActive: true
  };
}

/**
 * GET /api/settings/points - Get points settings
 */
export async function GET() {
  return withDatabase(async (db) => {
    try {
      const settings = await db.collection('settings').findOne({ type: 'points' });
      
      return ApiResponse.success(
        settings || getDefaultPointsSettings(),
        'Pengaturan poin berhasil dimuat'
      );
    } catch (error) {
      return handleApiError(error, 'Gagal memuat pengaturan poin');
    }
  });
}

/**
 * Validate points settings data
 * @param {Object} data - Settings data to validate
 * @returns {Object} Validation result
 */
function validatePointsSettings(data) {
  const requiredFields = {
    pointsPerPurchase: data.pointsPerPurchase,
    minimumPurchaseForPoints: data.minimumPurchaseForPoints,
    pointsToRupiah: data.pointsToRupiah,
    minimumRedeemPoints: data.minimumRedeemPoints
  };

  const validation = validateRequiredFields(requiredFields, Object.keys(requiredFields));
  if (!validation.valid) {
    return validation;
  }

  // Validate numeric values
  const numericFields = ['pointsPerPurchase', 'minimumPurchaseForPoints', 'pointsToRupiah', 'minimumRedeemPoints'];
  for (const field of numericFields) {
    const value = Number(data[field]);
    if (isNaN(value) || value < 0) {
      return { valid: false, error: `${field} harus berupa angka positif` };
    }
  }

  // Business logic validations
  if (Number(data.pointsPerPurchase) === 0) {
    return { valid: false, error: 'Points per purchase tidak boleh 0' };
  }

  if (Number(data.pointsToRupiah) === 0) {
    return { valid: false, error: 'Nilai tukar poin tidak boleh 0' };
  }

  if (Number(data.minimumRedeemPoints) < Number(data.pointsPerPurchase)) {
    return { valid: false, error: 'Minimum redeem points harus >= points per purchase' };
  }

  return { valid: true };
}

/**
 * POST /api/settings/points - Update points settings
 */
export async function POST(request) {
  return withDatabase(async (db) => {
    try {
      const body = await request.json().catch(() => null);
      if (!body) {
        return ApiResponse.error('Invalid JSON format', 400);
      }

      // Validate settings data
      const validation = validatePointsSettings(body);
      if (!validation.valid) {
        return ApiResponse.error(validation.error, 400);
      }

      const settings = {
        type: 'points',
        pointsPerPurchase: Number(body.pointsPerPurchase),
        minimumPurchaseForPoints: Number(body.minimumPurchaseForPoints),
        pointsToRupiah: Number(body.pointsToRupiah),
        minimumRedeemPoints: Number(body.minimumRedeemPoints),
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
        updatedAt: new Date()
      };

      await db.collection('settings').updateOne(
        { type: 'points' },
        { $set: settings },
        { upsert: true }
      );

      return ApiResponse.success(settings, 'Pengaturan poin berhasil disimpan');
    } catch (error) {
      return handleApiError(error, 'Gagal menyimpan pengaturan poin');
    }
  });
}
