// routes/cloudinaryRoutes.js  – Cloudinary Admin API Usage
const express = require('express');
const cloudinary = require('../config/cloudinary');
const router = express.Router();

/**
 * GET /api/admin/cloudinary/usage
 * Returns real-time usage data from Cloudinary Admin API
 * NEVER expose from frontend — backend only
 */
router.get('/usage', async (req, res) => {
  try {
    // Fetch usage data from Cloudinary Admin API
    const usage = await cloudinary.api.usage();

    // Helper: bytes → GB string
    const bytesToGB = (bytes) =>
      bytes ? (bytes / 1024 / 1024 / 1024).toFixed(2) : '0.00';

    // Calculate percentage used — safe for limit=0 (Free plan)
    const pct = (used, limit) =>
      limit && limit > 0 ? Math.round((used / limit) * 100) : 0;

    const storageUsedGB   = parseFloat(bytesToGB(usage.storage?.usage   || 0));
    const bandwidthUsedGB = parseFloat(bytesToGB(usage.bandwidth?.usage || 0));

    // Cloudinary Free plan doesn't return hard limits — use credits_usage % instead
    const storageCredPct   = usage.storage?.credits_usage   != null
      ? Math.min(Math.round((usage.storage.credits_usage   / (usage.credits?.limit || 25)) * 100), 100)
      : pct(usage.storage?.usage || 0, usage.storage?.limit || 1);

    const bandwidthCredPct = usage.bandwidth?.credits_usage != null
      ? Math.min(Math.round((usage.bandwidth.credits_usage / (usage.credits?.limit || 25)) * 100), 100)
      : pct(usage.bandwidth?.usage || 0, usage.bandwidth?.limit || 1);

    const transformPct = usage.transformations?.credits_usage != null
      ? Math.min(Math.round((usage.transformations.credits_usage / (usage.credits?.limit || 25)) * 100), 100)
      : pct(usage.transformations?.usage || 0, usage.transformations?.limit || 1);

    // Credits used %
    const creditsUsedPct = usage.credits?.used_percent != null
      ? Math.round(usage.credits.used_percent)
      : pct(usage.credits?.usage || 0, usage.credits?.limit || 1);

    // For display: if the API returns limit=0 (Free plan), show "Free plan" style
    const storageLimitGB   = usage.storage?.limit   > 0
      ? parseFloat(bytesToGB(usage.storage.limit))
      : null; // null = Free plan, no fixed limit

    const bandwidthLimitGB = usage.bandwidth?.limit > 0
      ? parseFloat(bytesToGB(usage.bandwidth.limit))
      : null;

    const response = {
      plan: usage.plan || 'Unknown',

      storage: {
        usedBytes:  usage.storage?.usage  || 0,
        limitBytes: usage.storage?.limit  || 0,
        usedGB:     storageUsedGB,
        limitGB:    storageLimitGB,
        creditsUsage: usage.storage?.credits_usage || 0,
        percentage: storageCredPct,
      },

      bandwidth: {
        usedBytes:  usage.bandwidth?.usage  || 0,
        limitBytes: usage.bandwidth?.limit  || 0,
        usedGB:     bandwidthUsedGB,
        limitGB:    bandwidthLimitGB,
        creditsUsage: usage.bandwidth?.credits_usage || 0,
        percentage: bandwidthCredPct,
      },

      transformations: {
        used:       usage.transformations?.usage  || 0,
        limit:      usage.transformations?.limit  || 0,
        creditsUsage: usage.transformations?.credits_usage || 0,
        percentage: transformPct,
      },

      objects:  usage.objects?.usage  || usage.objects  || 0,
      resources: usage.resources || 0,
      derived:   usage.derived_resources || 0,
      requests:  usage.requests || 0,

      credits: {
        used:    usage.credits?.usage     || 0,
        limit:   usage.credits?.limit     || 25,
        percent: creditsUsedPct,
      },

      impressions: usage.impressions?.usage || 0,

      fetchedAt: new Date().toISOString(),
    };

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error('Cloudinary usage fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Cloudinary usage',
      error: error.message,
    });
  }
});

/**
 * GET /api/admin/cloudinary/resources
 * Returns list of recent assets from Cloudinary
 */
router.get('/resources', async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 50,
      direction: 'desc',
    });

    res.status(200).json({
      success: true,
      data: {
        resources: result.resources,
        total_count: result.total_count,
      },
    });
  } catch (error) {
    console.error('Cloudinary resources fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Cloudinary resources',
      error: error.message,
    });
  }
});

/**
 * GET /api/admin/cloudinary/folders
 * Returns list of root folders from Cloudinary
 */
router.get('/folders', async (req, res) => {
  try {
    const result = await cloudinary.api.root_folders();
    res.status(200).json({ success: true, data: result.folders });
  } catch (error) {
    console.error('Cloudinary folders fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Cloudinary folders',
      error: error.message,
    });
  }
});

module.exports = router;
