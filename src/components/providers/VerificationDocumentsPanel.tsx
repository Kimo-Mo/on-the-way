import type { VerificationDocument } from '@/types/providers';
import { FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VerificationDocumentsPanelProps {
  documents: VerificationDocument[];
  missingRequiredTypes: string[];
}

export function VerificationDocumentsPanel({ documents, missingRequiredTypes }: VerificationDocumentsPanelProps) {
  return (
    <div className="bg-card rounded-md border p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Documents & Certificates
      </h3>

      {missingRequiredTypes.length > 0 && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 flex items-start gap-2 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Missing Required Documents</p>
            <ul className="list-disc pl-4 space-y-1">
              {missingRequiredTypes.map(type => (
                <li key={type}>{type}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {documents.length === 0 ? (
        <p className="text-sm text-muted-foreground">No documents uploaded.</p>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary p-2 rounded-md">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{doc.name}</span>
                  <span className="text-xs text-muted-foreground">Uploaded: {new Date(doc.uploadedAt).toISOString().split('T')[0]}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {doc.isAvailable ? (
                  <Badge variant="outline" className="text-success border-success/20 bg-success/10">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-destructive border-destructive/20 bg-destructive/10">
                    <AlertCircle className="h-3 w-3 mr-1" /> Unavailable
                  </Badge>
                )}
                {doc.previewUrl && doc.isAvailable && (
                  <a href={doc.previewUrl} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
                    View
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
