const express = require('express');
const router = express.Router();
const { getPageData, upsertSectionData, getSectionData, deleteSectionData } = require('../controllers/sectionController');

// GET list of all pages
router.get('/pages', async (req, res) => {
  try {
    const pages = await require('../models/SectionData').distinct('page');
    res.status(200).json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching pages', error: error.message });
  }
});

// GET all sections for a given page
router.get('/:page', getPageData);

// GET a specific section for a given page
router.get('/:page/:section', getSectionData);

// PUT update or create a specific section
router.put('/:page/:section', upsertSectionData);

// DELETE a specific section
router.delete('/:page/:section', deleteSectionData);

module.exports = router;
