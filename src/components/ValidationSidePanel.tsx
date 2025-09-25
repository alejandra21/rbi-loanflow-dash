import { useState } from 'react';
import { X, CheckSquare, XSquare, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface ValidationSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  phaseName: string;
  loanId: string;
}

export const ValidationSidePanel = ({ isOpen, onClose, phaseName, loanId }: ValidationSidePanelProps) => {
  const [decision, setDecision] = useState<'approved' | 'rejected' | 'info_requested' | ''>('');
  const [comments, setComments] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = () => {
    if (!decision || !comments) return;
    
    // Here you would normally submit to backend
    console.log('Validation submitted:', {
      loanId,
      phase: phaseName,
      decision,
      comments,
      severity,
      timestamp: new Date().toISOString()
    });
    
    // Reset form
    setDecision('');
    setComments('');
    setSeverity('medium');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/20" onClick={onClose} />
      <div className="w-96 bg-background border-l shadow-lg flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold">Manual Validation</h3>
            <p className="text-sm text-muted-foreground">{phaseName} - {loanId}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div>
            <label className="text-sm font-medium mb-2 block">Decision</label>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant={decision === 'approved' ? 'default' : 'outline'}
                onClick={() => setDecision('approved')}
                className="justify-start"
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                variant={decision === 'rejected' ? 'destructive' : 'outline'}
                onClick={() => setDecision('rejected')}
                className="justify-start"
              >
                <XSquare className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                variant={decision === 'info_requested' ? 'secondary' : 'outline'}
                onClick={() => setDecision('info_requested')}
                className="justify-start"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Request Info
              </Button>
            </div>
          </div>

          {decision === 'rejected' && (
            <div>
              <label className="text-sm font-medium mb-2 block">Severity</label>
              <Select value={severity} onValueChange={(value: 'low' | 'medium' | 'high') => setSeverity(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center space-x-2">
                      <Badge variant="success" className="w-2 h-2 rounded-full p-0" />
                      <span>Low</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center space-x-2">
                      <Badge variant="warning" className="w-2 h-2 rounded-full p-0" />
                      <span>Medium</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center space-x-2">
                      <Badge variant="destructive" className="w-2 h-2 rounded-full p-0" />
                      <span>High</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-2 block">
              Comments {decision === 'info_requested' && '(Specify required information)'}
            </label>
            <Textarea
              placeholder={
                decision === 'approved' 
                  ? 'Optional approval notes...'
                  : decision === 'rejected'
                  ? 'Explain reasons for rejection...'
                  : decision === 'info_requested'
                  ? 'Specify what information is needed...'
                  : 'Add your validation comments...'
              }
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={6}
            />
          </div>

          <div className="bg-muted/50 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Validation Checklist</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Review all uploaded documents</li>
              <li>• Verify data accuracy</li>
              <li>• Check compliance requirements</li>
              <li>• Assess risk factors</li>
            </ul>
          </div>
        </div>
        
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Button 
              onClick={handleSubmit} 
              disabled={!decision || !comments}
              className="flex-1"
            >
              Submit Validation
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};