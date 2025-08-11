'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, Download, FileText, Loader2, CheckCircle } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';

interface ImportGuestsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportGuestsDialog({ open, onOpenChange }: ImportGuestsDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const { getToken } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const token = await getToken();
      if (!token) {
        console.error('No authentication token available');
        return;
      }
      
      const response = await apiClient.importGuests(token, file, 'event-id'); // TODO: Get actual event ID
      
      if (response.success) {
        setUploaded(true);
        setTimeout(() => {
          onOpenChange(false);
          setFile(null);
          setUploaded(false);
        }, 2000);
      } else {
        console.error('Error importing guests:', response.error);
      }
    } catch (error) {
      console.error('Error importing guests:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `Name,Email,Phone,NumberOfGuests,MealPreference,Notes
John Doe,john@example.com,+1 (555) 123-4567,2,vegetarian,Special dietary requirements
Jane Smith,jane@example.com,,1,no-preference,
`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guests-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Guest List</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {!uploaded ? (
            <>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload CSV File</h3>
                  <p className="text-gray-600 mb-4">
                    Import your guest list from a CSV file. Make sure your file includes the required columns.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="csv-file">Select CSV File</Label>
                  <input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                {file && (
                  <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                    <FileText className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-green-700">{file.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Required Columns</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={downloadTemplate}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Required:</span>
                      <ul className="mt-1 space-y-1 text-gray-600">
                        <li>• Name</li>
                        <li>• Email</li>
                      </ul>
                    </div>
                    <div>
                      <span className="font-medium">Optional:</span>
                      <ul className="mt-1 space-y-1 text-gray-600">
                        <li>• Phone</li>
                        <li>• NumberOfGuests</li>
                        <li>• MealPreference</li>
                        <li>• Notes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    'Import Guests'
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Successful!</h3>
              <p className="text-gray-600">Your guest list has been imported successfully.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 