import ImageUploadForm from '@/components/ImageUploadForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function UploadPage() {
  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 flex justify-center items-center">
      <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Ladda upp bild</h1>
      <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
        Ladda upp en bild i format JPG eller PNG. Max filstorlek är 10MB. 
        Bilden kommer att optimeras automatiskt.
      </p>
      <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className='mt-1'>
            Observera att vi just nu endast kan ta emot bilder från godkända e-postadresser.
          </AlertDescription>
        </Alert>
      <ImageUploadForm />
      </div>
    </div>
  );
}