'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  Copy, 
  Eye,
  Settings,
  Type,
  List,
  CheckSquare,
  MessageSquare,
  Users,
  Utensils,
  Music,
  Heart,
  Star,
  Sparkles,
  Crown,
  Zap,
  Palette,
  Search
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { apiClient } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'select' | 'multiselect' | 'textarea' | 'checkbox' | 'radio';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: string;
  groupWith?: string; // For plus-ones grouping
  order: number;
}

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: 'wedding' | 'corporate' | 'social' | 'celebration' | 'premium';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  popularity: number; // 1-5 stars
  fields: FormField[];
  design: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    style: 'elegant' | 'modern' | 'romantic' | 'professional' | 'playful';
  };
  preview: {
    image?: string;
    demoUrl?: string;
  };
  tags: string[];
  estimatedTime: string;
}

interface RsvpFormBuilderProps {
  eventId: string;
}

const defaultFields: FormField[] = [
  {
    id: 'name',
    type: 'text',
    label: 'Full Name',
    required: true,
    placeholder: 'Enter your full name',
    order: 0,
  },
  {
    id: 'email',
    type: 'email',
    label: 'Email Address',
    required: true,
    placeholder: 'Enter your email address',
    order: 1,
  },
  {
    id: 'attending',
    type: 'radio',
    label: 'Will you be attending?',
    required: true,
    options: ['Yes, I\'ll be there!', 'Sorry, I can\'t make it'],
    order: 2,
  },
];

const prebuiltTemplates: FormTemplate[] = [
  {
    id: 'elegant-wedding',
    name: 'Elegant Wedding',
    description: 'Sophisticated and timeless design perfect for formal weddings',
    category: 'wedding',
    difficulty: 'beginner',
    popularity: 5,
    fields: [
      ...defaultFields,
      {
        id: 'numberOfGuests',
        type: 'number',
        label: 'Number of Guests',
        required: false,
        placeholder: 'How many people are attending?',
        order: 3,
      },
      {
        id: 'mealPreference',
        type: 'select',
        label: 'Meal Preference',
        required: false,
        options: ['No Preference', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'],
        order: 4,
      },
      {
        id: 'dietaryRestrictions',
        type: 'textarea',
        label: 'Dietary Restrictions',
        required: false,
        placeholder: 'Please list any dietary restrictions or allergies',
        order: 5,
      },
    ],
    design: {
      primaryColor: '#8B5CF6',
      secondaryColor: '#F3F4F6',
      accentColor: '#F59E0B',
      fontFamily: 'Playfair Display',
      style: 'elegant',
    },
    preview: {
      demoUrl: '/templates/elegant-wedding',
    },
    tags: ['wedding', 'elegant', 'formal', 'sophisticated'],
    estimatedTime: '5 minutes',
  },
  {
    id: 'romantic-garden-wedding',
    name: 'Romantic Garden Wedding',
    description: 'Dreamy and romantic design with nature-inspired elements',
    category: 'wedding',
    difficulty: 'intermediate',
    popularity: 5,
    fields: [
      ...defaultFields,
      {
        id: 'numberOfGuests',
        type: 'number',
        label: 'Number of Guests',
        required: false,
        placeholder: 'How many people are attending?',
        order: 3,
      },
      {
        id: 'mealPreference',
        type: 'select',
        label: 'Meal Preference',
        required: false,
        options: ['No Preference', 'Vegetarian', 'Vegan', 'Gluten-Free'],
        order: 4,
      },
      {
        id: 'dietaryRestrictions',
        type: 'textarea',
        label: 'Dietary Restrictions',
        required: false,
        placeholder: 'Please list any dietary restrictions or allergies',
        order: 5,
      },
      {
        id: 'songRequest',
        type: 'text',
        label: 'Song Request',
        required: false,
        placeholder: 'What song will get you on the dance floor?',
        order: 6,
      },
      {
        id: 'message',
        type: 'textarea',
        label: 'Message to the Couple',
        required: false,
        placeholder: 'Share your excitement, well wishes, or any special requests...',
        order: 7,
      },
    ],
    design: {
      primaryColor: '#EC4899',
      secondaryColor: '#FDF2F8',
      accentColor: '#10B981',
      fontFamily: 'Dancing Script',
      style: 'romantic',
    },
    preview: {
      demoUrl: '/templates/romantic-garden',
    },
    tags: ['wedding', 'romantic', 'garden', 'nature', 'dreamy'],
    estimatedTime: '8 minutes',
  },
  {
    id: 'modern-minimalist-wedding',
    name: 'Modern Minimalist',
    description: 'Clean, contemporary design with sophisticated simplicity',
    category: 'wedding',
    difficulty: 'beginner',
    popularity: 4,
    fields: [
      ...defaultFields,
      {
        id: 'numberOfGuests',
        type: 'number',
        label: 'Number of Guests',
        required: false,
        placeholder: 'How many people are attending?',
        order: 3,
      },
      {
        id: 'mealPreference',
        type: 'select',
        label: 'Meal Preference',
        required: false,
        options: ['No Preference', 'Vegetarian', 'Vegan', 'Gluten-Free'],
        order: 4,
      },
    ],
    design: {
      primaryColor: '#1F2937',
      secondaryColor: '#F9FAFB',
      accentColor: '#3B82F6',
      fontFamily: 'Inter',
      style: 'modern',
    },
    preview: {
      demoUrl: '/templates/modern-minimalist',
    },
    tags: ['wedding', 'modern', 'minimalist', 'clean', 'contemporary'],
    estimatedTime: '3 minutes',
  },
  {
    id: 'luxury-corporate-event',
    name: 'Luxury Corporate Event',
    description: 'Premium design for high-end corporate gatherings and conferences',
    category: 'corporate',
    difficulty: 'intermediate',
    popularity: 4,
    fields: [
      ...defaultFields,
      {
        id: 'company',
        type: 'text',
        label: 'Company',
        required: false,
        placeholder: 'Your company name',
        order: 3,
      },
      {
        id: 'jobTitle',
        type: 'text',
        label: 'Job Title',
        required: false,
        placeholder: 'Your position',
        order: 4,
      },
      {
        id: 'dietaryRestrictions',
        type: 'textarea',
        label: 'Dietary Requirements',
        required: false,
        placeholder: 'Any dietary requirements or allergies',
        order: 5,
      },
      {
        id: 'specialRequests',
        type: 'textarea',
        label: 'Special Requests',
        required: false,
        placeholder: 'Any special accommodations needed',
        order: 6,
      },
    ],
    design: {
      primaryColor: '#1E293B',
      secondaryColor: '#F8FAFC',
      accentColor: '#F59E0B',
      fontFamily: 'Poppins',
      style: 'professional',
    },
    preview: {
      demoUrl: '/templates/luxury-corporate',
    },
    tags: ['corporate', 'luxury', 'professional', 'premium', 'business'],
    estimatedTime: '6 minutes',
  },
  {
    id: 'birthday-celebration',
    name: 'Birthday Celebration',
    description: 'Fun and vibrant design perfect for birthday parties',
    category: 'celebration',
    difficulty: 'beginner',
    popularity: 4,
    fields: [
      ...defaultFields,
      {
        id: 'numberOfGuests',
        type: 'number',
        label: 'Number of Guests',
        required: false,
        placeholder: 'How many people are attending?',
        order: 3,
      },
      {
        id: 'giftPreference',
        type: 'select',
        label: 'Gift Preference',
        required: false,
        options: ['No gifts please', 'Gift cards', 'Donation to charity', 'Surprise me!'],
        order: 4,
      },
      {
        id: 'favoriteColor',
        type: 'select',
        label: 'Favorite Color',
        required: false,
        options: ['Red', 'Blue', 'Green', 'Purple', 'Pink', 'Yellow', 'Orange'],
        order: 5,
      },
      {
        id: 'message',
        type: 'textarea',
        label: 'Birthday Message',
        required: false,
        placeholder: 'Share your excitement for the celebration!',
        order: 6,
      },
    ],
    design: {
      primaryColor: '#F97316',
      secondaryColor: '#FEF3C7',
      accentColor: '#EC4899',
      fontFamily: 'Comic Sans MS',
      style: 'playful',
    },
    preview: {
      demoUrl: '/templates/birthday-celebration',
    },
    tags: ['birthday', 'celebration', 'fun', 'vibrant', 'party'],
    estimatedTime: '4 minutes',
  },
  {
    id: 'premium-wedding-suite',
    name: 'Premium Wedding Suite',
    description: 'Ultimate wedding experience with advanced features and elegant design',
    category: 'premium',
    difficulty: 'advanced',
    popularity: 5,
    fields: [
      ...defaultFields,
      {
        id: 'numberOfGuests',
        type: 'number',
        label: 'Number of Guests',
        required: false,
        placeholder: 'How many people are attending?',
        order: 3,
      },
      {
        id: 'mealPreference',
        type: 'select',
        label: 'Meal Preference',
        required: false,
        options: ['No Preference', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo'],
        order: 4,
      },
      {
        id: 'dietaryRestrictions',
        type: 'textarea',
        label: 'Dietary Restrictions',
        required: false,
        placeholder: 'Please list any dietary restrictions or allergies',
        order: 5,
      },
      {
        id: 'songRequest',
        type: 'text',
        label: 'Song Request',
        required: false,
        placeholder: 'What song will get you on the dance floor?',
        order: 6,
      },
      {
        id: 'message',
        type: 'textarea',
        label: 'Message to the Couple',
        required: false,
        placeholder: 'Share your excitement, well wishes, or any special requests...',
        order: 7,
      },
      {
        id: 'photographyConsent',
        type: 'checkbox',
        label: 'Photography Consent',
        required: false,
        options: ['I consent to being photographed during the event'],
        order: 8,
      },
      {
        id: 'transportation',
        type: 'select',
        label: 'Transportation Needs',
        required: false,
        options: ['I have my own transportation', 'I need a ride', 'I can offer rides to others'],
        order: 9,
      },
    ],
    design: {
      primaryColor: '#7C3AED',
      secondaryColor: '#F3F4F6',
      accentColor: '#F59E0B',
      fontFamily: 'Crimson Text',
      style: 'elegant',
    },
    preview: {
      demoUrl: '/templates/premium-wedding-suite',
    },
    tags: ['premium', 'wedding', 'advanced', 'luxury', 'comprehensive'],
    estimatedTime: '12 minutes',
  },
];

const fieldTypes = [
  { type: 'text', label: 'Text Input', icon: Type },
  { type: 'email', label: 'Email Input', icon: Type },
  { type: 'phone', label: 'Phone Input', icon: Type },
  { type: 'number', label: 'Number Input', icon: Type },
  { type: 'select', label: 'Dropdown', icon: List },
  { type: 'multiselect', label: 'Multi-Select', icon: CheckSquare },
  { type: 'radio', label: 'Radio Buttons', icon: CheckSquare },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { type: 'textarea', label: 'Text Area', icon: MessageSquare },
];

export function RsvpFormBuilder({ eventId }: RsvpFormBuilderProps) {
  const { getToken } = useAuth();
  const [fields, setFields] = useState<FormField[]>(defaultFields);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFormFields();
  }, [eventId]);

  const loadFormFields = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      
      // TODO: Load saved form fields from API
      // const response = await apiClient.getFormFields(token, eventId);
      // if (response.success && response.data) {
      //   setFields(response.data);
      // }
    } catch (error) {
      console.error('Error loading form fields:', error);
    }
  };

  const saveFormFields = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      
      // TODO: Save form fields to API
      // await apiClient.saveFormFields(token, eventId, fields);
    } catch (error) {
      console.error('Error saving form fields:', error);
    }
  };

  const addField = (fieldType: string) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: fieldType as FormField['type'],
      label: 'New Field',
      required: false,
      order: fields.length,
    };
    
    if (fieldType === 'select' || fieldType === 'multiselect' || fieldType === 'radio') {
      newField.options = ['Option 1', 'Option 2'];
    }
    
    setFields([...fields, newField]);
    setSelectedField(newField);
    setShowFieldModal(true);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  const deleteField = (fieldId: string) => {
    setFields(fields.filter(field => field.id !== fieldId));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  };

  const applyTemplate = (template: FormTemplate) => {
    setFields(template.fields);
    setShowTemplateModal(false);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order numbers
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setFields(updatedItems);
  };

  const renderFieldPreview = (field: FormField): React.ReactElement => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <Input
            placeholder={field.placeholder || field.label}
            disabled
            className="bg-gray-50"
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder || field.label}
            disabled
            className="bg-gray-50"
          />
        );
      case 'select':
        return (
          <Select disabled>
            <SelectTrigger className="bg-gray-50">
              <SelectValue placeholder={field.placeholder || field.label} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  disabled
                  className="text-pink-500"
                />
                <Label className="text-sm">{option}</Label>
              </div>
            ))}
          </div>
        );
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder || field.label}
            disabled
            className="bg-gray-50"
            rows={3}
          />
        );
      default:
        return <div className="text-gray-500">Field type not supported</div>;
    }
  };

  const filteredTemplates = prebuiltTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'wedding': return <Heart className="h-4 w-4" />;
      case 'corporate': return <Crown className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      case 'celebration': return <Sparkles className="h-4 w-4" />;
      case 'premium': return <Star className="h-4 w-4" />;
      default: return <Palette className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">RSVP Form Builder</h2>
          <p className="text-gray-600 mt-1">Create the perfect RSVP form with our professional templates</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setShowTemplateModal(true)}>
            <Sparkles className="h-4 w-4 mr-2" />
            Choose Template
          </Button>
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </Button>
          <Button onClick={saveFormFields}>
            Save Form
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Field Types Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Add Fields</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {fieldTypes.map((fieldType) => {
              const Icon = fieldType.icon;
              return (
                <Button
                  key={fieldType.type}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addField(fieldType.type)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {fieldType.label}
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Form Builder */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Form Fields</CardTitle>
            </CardHeader>
            <CardContent>
              {previewMode ? (
                <div className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label className="text-sm font-medium">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {renderFieldPreview(field)}
                    </div>
                  ))}
                </div>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="form-fields">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-3"
                      >
                        {fields.map((field, index) => (
                          <Draggable key={field.id} draggableId={field.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`p-4 border rounded-lg ${
                                  snapshot.isDragging ? 'shadow-lg' : 'bg-white'
                                } ${
                                  selectedField?.id === field.id ? 'ring-2 ring-pink-500' : ''
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div {...provided.dragHandleProps}>
                                      <GripVertical className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Badge variant="outline">{field.type}</Badge>
                                      <span className="font-medium">{field.label}</span>
                                      {field.required && <span className="text-red-500">*</span>}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setSelectedField(field)}
                                    >
                                      <Settings className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteField(field.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Field Settings Modal */}
      {selectedField && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Field Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Field Label</Label>
                <Input
                  value={selectedField.label}
                  onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Placeholder</Label>
                <Input
                  value={selectedField.placeholder || ''}
                  onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={selectedField.required}
                onCheckedChange={(checked) => updateField(selectedField.id, { required: checked })}
              />
              <Label>Required field</Label>
            </div>
            
            {(selectedField.type === 'select' || selectedField.type === 'multiselect' || selectedField.type === 'radio') && (
              <div className="space-y-2">
                <Label>Options</Label>
                <div className="space-y-2">
                  {selectedField.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(selectedField.options || [])];
                          newOptions[index] = e.target.value;
                          updateField(selectedField.id, { options: newOptions });
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newOptions = selectedField.options?.filter((_, i) => i !== index);
                          updateField(selectedField.id, { options: newOptions });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newOptions = [...(selectedField.options || []), `Option ${(selectedField.options?.length || 0) + 1}`];
                      updateField(selectedField.id, { options: newOptions });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Enhanced Templates Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="h-6 w-6 text-pink-500" />
                    <span>Choose Your Perfect Template</span>
                  </CardTitle>
                  <p className="text-gray-600 mt-1">Select from our professionally designed templates</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTemplateModal(false)}
                >
                  ✕
                </Button>
              </div>
              
              {/* Search and Filter */}
              <div className="flex items-center space-x-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="celebration">Celebration</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="group relative border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer bg-white"
                    onClick={() => applyTemplate(template)}
                  >
                    {/* Template Preview */}
                    <div 
                      className="h-48 bg-gradient-to-br relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${template.design.primaryColor}20, ${template.design.secondaryColor}40)`,
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                               style={{ backgroundColor: template.design.primaryColor }}>
                            {getCategoryIcon(template.category)}
                          </div>
                          <h3 className="font-semibold text-lg" style={{ color: template.design.primaryColor }}>
                            {template.name}
                          </h3>
                        </div>
                      </div>
                      
                      {/* Popularity Badge */}
                      {template.popularity >= 4 && (
                        <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-current" />
                          <span>Popular</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Template Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                          {template.name}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={getDifficultyColor(template.difficulty)}
                        >
                          {template.difficulty}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {template.description}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{template.estimatedTime}</span>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < template.popularity 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Fields Preview */}
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-500 mb-2">Includes {template.fields.length} fields:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.fields.slice(0, 4).map((field) => (
                            <Badge key={field.id} variant="outline" className="text-xs">
                              {field.label}
                            </Badge>
                          ))}
                          {template.fields.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.fields.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-pink-500 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button size="sm" className="bg-pink-500 hover:bg-pink-600">
                          <Zap className="h-4 w-4 mr-2" />
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 