import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUpload, 
  FiPlus, 
  FiX, 
  FiSave, 
  FiArrowLeft,
  FiFileText,
  FiDollarSign,
  FiTag,
  FiUsers,
  FiList,
  FiCheckCircle
} from 'react-icons/fi';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: '',
    level: 'beginner',
    price: 0,
    discount: 0,
    thumbnail: null,
    thumbnailPreview: '',
    learningObjectives: [''],
    requirements: [''],
    targetAudience: ['']
  });

  const categories = [
    'Development', 'Business', 'Finance & Accounting', 'IT & Software',
    'Office Productivity', 'Personal Development', 'Design', 'Marketing',
    'Lifestyle', 'Photography', 'Health & Fitness', 'Music', 'Teaching & Academics'
  ];

  const levels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'all', label: 'All Levels' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          thumbnail: file,
          thumbnailPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayInputChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would send the form data to your API
      console.log('Course submitted:', formData);
      
      // Show success message
      setIsPublished(true);
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (isPublished) {
    return (
      <div className="min-h-screen bg-slate-900 text-white pt-20">
        <div className="max-w-3xl mx-auto p-6">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Course Published Successfully!</h2>
            <p className="text-gray-400 mb-6">Your course is now live and available to students.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-primary hover:bg-primary/90 rounded-md text-white font-medium"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  setIsPublished(false);
                  setCurrentStep(1);
                  // Reset form if needed
                }}
                className="px-6 py-2 border border-gray-600 hover:bg-slate-800 rounded-md text-white font-medium"
              >
                Create Another Course
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step 
                      ? 'bg-primary text-white' 
                      : 'bg-slate-700 text-gray-400'
                  }`}
                >
                  {step}
                </div>
                <span className="text-xs mt-2 text-gray-400">
                  {step === 1 ? 'Basic Info' : step === 2 ? 'Details' : 'Pricing'}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-4">
            <div className="absolute top-0 left-0 h-1 bg-slate-700 w-full"></div>
            <div 
              className="absolute top-0 left-0 h-1 bg-primary transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="bg-slate-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-6">Course Information</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Course Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="e.g., Learn Advanced React"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="A brief description of what students will learn"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="Detailed description of your course"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-primary hover:bg-primary/90 rounded-md text-white font-medium"
                >
                  Next: Details
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Course Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-slate-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-6">Course Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category.toLowerCase()}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      required
                    >
                      {levels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Course Thumbnail
                  </label>
                  <div className="mt-1 flex items-center">
                    <label className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-600 rounded-lg bg-slate-700 hover:bg-slate-700/50 transition-colors">
                        {formData.thumbnailPreview ? (
                          <img 
                            src={formData.thumbnailPreview} 
                            alt="Thumbnail preview" 
                            className="h-full w-full object-cover rounded-lg"
                          />
                        ) : (
                          <>
                            <FiUpload className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-400">
                              <span className="text-primary font-medium">Upload an image</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Learning Objectives
                  </label>
                  <div className="space-y-2">
                    {formData.learningObjectives.map((objective, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={objective}
                          onChange={(e) => handleArrayInputChange('learningObjectives', index, e.target.value)}
                          className="flex-1 bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          placeholder={`Objective ${index + 1}`}
                        />
                        {formData.learningObjectives.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('learningObjectives', index)}
                            className="ml-2 p-2 text-gray-400 hover:text-red-400"
                          >
                            <FiX />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('learningObjectives')}
                      className="flex items-center text-sm text-primary hover:text-primary/80 mt-2"
                    >
                      <FiPlus className="mr-1" /> Add Objective
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Requirements
                  </label>
                  <div className="space-y-2">
                    {formData.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={requirement}
                          onChange={(e) => handleArrayInputChange('requirements', index, e.target.value)}
                          className="flex-1 bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          placeholder={`Requirement ${index + 1}`}
                        />
                        {formData.requirements.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('requirements', index)}
                            className="ml-2 p-2 text-gray-400 hover:text-red-400"
                          >
                            <FiX />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('requirements')}
                      className="flex items-center text-sm text-primary hover:text-primary/80 mt-2"
                    >
                      <FiPlus className="mr-1" /> Add Requirement
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target Audience
                  </label>
                  <div className="space-y-2">
                    {formData.targetAudience.map((audience, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={audience}
                          onChange={(e) => handleArrayInputChange('targetAudience', index, e.target.value)}
                          className="flex-1 bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          placeholder={`Audience ${index + 1}`}
                        />
                        {formData.targetAudience.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('targetAudience', index)}
                            className="ml-2 p-2 text-gray-400 hover:text-red-400"
                          >
                            <FiX />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('targetAudience')}
                      className="flex items-center text-sm text-primary hover:text-primary/80 mt-2"
                    >
                      <FiPlus className="mr-1" /> Add Audience
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-600 hover:bg-slate-800 rounded-md text-white font-medium"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-primary hover:bg-primary/90 rounded-md text-white font-medium"
                >
                  Next: Pricing
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-slate-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-6">Pricing</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Price (USD) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 pl-10 pr-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Discount (%)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiTag className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 pl-10 pr-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Pricing Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Base Price</span>
                      <span>${parseFloat(formData.price || 0).toFixed(2)}</span>
                    </div>
                    {formData.discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Discount ({formData.discount}%)</span>
                        <span className="text-green-400">-${(formData.price * (formData.discount / 100)).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-600 my-2"></div>
                    <div className="flex justify-between font-medium">
                      <span>You'll receive</span>
                      <span>
                        ${(formData.price * (1 - (formData.dount || 0) / 100)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-600 hover:bg-slate-800 rounded-md text-white font-medium"
                >
                  Back
                </button>
                <div className="space-x-4">
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-600 hover:bg-slate-800 rounded-md text-white font-medium"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 bg-primary hover:bg-primary/90 rounded-md text-white font-medium ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Course'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
