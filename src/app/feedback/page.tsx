import FeedbackForm from '@/components/FeedbackForm';
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function FeedbackPage() {
  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 flex justify-center items-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Feedback</h1>
        <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
          Vi värdesätter dina synpunkter och arbetar ständigt för att förbättra PixAI. 
          Oavsett om du har förslag på förbättringar eller har stött på problem, 
          hjälper din feedback oss att skapa en bättre upplevelse för alla användare.
        </p>
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className='mt-1'>
            Observera att vi endast kan ta emot feedback från godkända e-postadresser.
          </AlertDescription>
        </Alert>
        <FeedbackForm />
      </div>
    </div>
  );
}