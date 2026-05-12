const SectionData = require('../models/SectionData');

// ─── GET all sections for a page ──────────────────────────────────────────────
exports.getPageData = async (req, res) => {
  try {
    const { page } = req.params;
    const data = await SectionData.find({ page });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching page data', error: error.message });
  }
};

// ─── GET one section ──────────────────────────────────────────────────────────
exports.getSectionData = async (req, res) => {
  try {
    const { page, section } = req.params;
    const data = await SectionData.findOne({ page, section });

    if (!data) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching section data', error: error.message });
  }
};

// ─── PUT update or create section ─────────────────────────────────────────────
exports.upsertSectionData = async (req, res) => {
  try {
    const { page, section } = req.params;
    const updateData = req.body;

    // We allow page and section to be in params OR body, but params take priority
    const targetPage = page || updateData.page;
    const targetSection = section || updateData.section;

    if (!targetPage || !targetSection) {
      return res.status(400).json({ success: false, message: 'Page and section are required identifiers.' });
    }

    // Prepare the document data
    const dataToSave = {
      ...updateData,
      page: targetPage,
      section: targetSection
    };

    const updated = await SectionData.findOneAndUpdate(
      { page: targetPage, section: targetSection },
      { $set: dataToSave },
      { 
        new: true, 
        upsert: true, 
        runValidators: true,
        setDefaultsOnInsert: true 
      }
    );

    res.status(200).json({ 
      success: true, 
      message: `Section '${targetSection}' on page '${targetPage}' successfully updated.`,
      data: updated 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving section data', error: error.message });
  }
};

// ─── DELETE a section ─────────────────────────────────────────────────────────
exports.deleteSectionData = async (req, res) => {
  try {
    const { page, section } = req.params;
    const deleted = await SectionData.findOneAndDelete({ page, section });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Section not found to delete' });
    }

    res.status(200).json({ success: true, message: 'Section deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting section', error: error.message });
  }
};
