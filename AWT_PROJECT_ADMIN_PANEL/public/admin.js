//add master category

document.getElementById('masterCategoryForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const name = document.getElementById('master_category').value.trim();
    if (!name) {
      return alert('Please enter a master category name');
    }
  
    try {
      const response = await fetch('/api/add-master-category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });
  
      const result = await response.json();
  
      if (result.success) {
        alert('✅ Master category added successfully!');
        document.getElementById('masterCategoryForm').reset();
        // Refresh master categories dropdown immediately
        await loadMasterCategories(true);
      } else {
        alert('❌ Failed to add category: ' + result.message);
      }
    } catch (error) {
      console.error('Error adding master category:', error);
      alert('❌ Error: Could not add category');
    }
  });
  
//add category and fetch master categories

document.querySelector("#CategoryForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const category = document.querySelector('input[name="category"]').value;
    const master_id = document.querySelector('#master_id').value;
  
    console.log('Submitting category:', { category, master_id });
  
    try {
      const res = await fetch("http://localhost:3000/api/category/add-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: category, master_id })
      });
  
      const data = await res.json();
      console.log('Server response:', data);
      
      if (data.success) {
        alert("✅ Category added successfully!");
        document.querySelector('input[name="category"]').value = '';
        location.reload();
      } else {
        alert("❌ Failed to add category: " + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert("❌ Server error: " + err.message);
    }
  });
  
  
  // Fetch master categories and populate <select>
  document.addEventListener('DOMContentLoaded', async () => {
    await loadMasterCategories(true);
    await loadCategories(true);
  });

  // Template upload functionality
  document.getElementById('templateForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    const category = document.getElementById('template_category').value;
    const fileInput = document.querySelector('input[name="templateImage"]');
    
    if (!category) {
      alert('Please select a category');
      return;
    }
    
    if (!fileInput.files[0]) {
      alert('Please select a file');
      return;
    }
    
    formData.append('category', category);
    formData.append('templateImage', fileInput.files[0]);
    
    console.log('Uploading template:', { category, fileName: fileInput.files[0].name });
    
    try {
      const response = await fetch('/api/template/upload', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      console.log('Upload response:', result);
      
      if (result.success) {
        alert('✅ Template uploaded successfully!');
        document.getElementById('templateForm').reset();
      } else {
        alert('❌ Upload failed: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Upload error: ' + error.message);
    }
  });

  // Frame upload functionality
  document.getElementById('frameForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    const fileInput = document.getElementById('frameImage');
    
    if (!fileInput.files[0]) {
      alert('Please select a frame image');
      return;
    }
    
    formData.append('frameImage', fileInput.files[0]);
    
    // Get all element data
    const elements = [];
    const xPositions = [];
    const yPositions = [];
    const fontSizes = [];
    const colors = [];
    
    const elementBlocks = document.querySelectorAll('.element-block');
    
    for (const block of elementBlocks) {
      const elementSelect = block.querySelector('select[name="elements[]"]');
      const xInput = block.querySelector('input[name="x[]"]');
      const yInput = block.querySelector('input[name="y[]"]');
      const fontSizeInput = block.querySelector('input[name="font_size[]"]');
      const colorInput = block.querySelector('input[name="color[]"]');
      
      if (elementSelect.value && xInput.value && yInput.value) {
        elements.push(elementSelect.value);
        xPositions.push(xInput.value);
        yPositions.push(yInput.value);
        fontSizes.push(fontSizeInput.value || '0');
        colors.push(colorInput.value || '#000000');
      }
    }
    
    if (elements.length === 0) {
      alert('Please add at least one element position');
      return;
    }
    
    // Add element data to form - send as individual form fields
    elements.forEach((element, index) => {
      formData.append('elements', element);
      formData.append('x', xPositions[index]);
      formData.append('y', yPositions[index]);
      formData.append('font_size', fontSizes[index]);
      formData.append('color', colors[index]);
    });
    
    console.log('Uploading frame with elements:', { 
      fileName: fileInput.files[0].name, 
      elementsCount: elements.length 
    });
    
    try {
      const response = await fetch('/api/frame/upload-with-elements', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      console.log('Frame upload response:', result);
      
      if (result.success) {
        alert('✅ Frame and elements uploaded successfully!');
        document.getElementById('frameForm').reset();
        // Clear element blocks
        document.getElementById('elementsContainer').innerHTML = '';
        addElementBlock(); // Add one default element block
      } else {
        alert('❌ Upload failed: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Frame upload error:', error);
      alert('❌ Upload error: ' + error.message);
    }
  });
  
  // Load master categories for the first form
  async function loadMasterCategories(reset = false) {
    const select = document.getElementById('master_id');
    if (!select) return;
    // Clear existing options
    if (reset) {
      select.innerHTML = '';
      const def = document.createElement('option');
      def.value = '';
      def.innerText = 'Select master category';
      select.appendChild(def);
    }
    
    try {
      const res = await fetch('/api/category/master-categories');
      const masters = await res.json();
      
      console.log('Loaded master categories:', masters);
      
      if (Array.isArray(masters) && masters.length === 0) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.innerText = 'No master categories available. Please add one first.';
        opt.disabled = true;
        select.appendChild(opt);
      } else if (Array.isArray(masters)) {
        masters.forEach(master => {
          const opt = document.createElement('option');
          opt.value = master._id;
          opt.innerText = master.name;
          select.appendChild(opt);
        });
      }
    } catch (error) {
      console.error('Error loading master categories:', error);
      const opt = document.createElement('option');
      opt.value = '';
      opt.innerText = 'Error loading master categories';
      opt.disabled = true;
      select.appendChild(opt);
    }
  }

  // Load categories for template form
  async function loadCategories(reset = false) {
    const select = document.getElementById('template_category');
    if (!select) return;
    if (reset) {
      select.innerHTML = '';
      const def = document.createElement('option');
      def.value = '';
      def.innerText = 'Select category';
      select.appendChild(def);
    }
    
    try {
      const res = await fetch('/api/category/all');
      const data = await res.json();
      
      console.log('Loaded categories:', data);
      
      if (data.success && data.categories.length === 0) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.innerText = 'No categories available. Please add categories first.';
        opt.disabled = true;
        select.appendChild(opt);
      } else if (data.success) {
        data.categories.forEach(category => {
          const opt = document.createElement('option');
          opt.value = category._id;
          opt.innerText = category.name;
          select.appendChild(opt);
        });
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      const opt = document.createElement('option');
      opt.value = '';
      opt.innerText = 'Error loading categories';
      opt.disabled = true;
      select.appendChild(opt);
    }
  }
  