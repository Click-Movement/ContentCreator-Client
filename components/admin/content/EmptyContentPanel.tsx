import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { cardStyles, buttonStyles } from '@/lib/dashboard-theme';

type EmptyContentPanelProps = {
  title: string;
  description: string;
  emptyMessage: string;
  emptyDescription: string;
  buttonText: string;
  onButtonClick: () => void;
};

export default function EmptyContentPanel({
  title,
  description,
  emptyMessage,
  emptyDescription,
  buttonText,
  onButtonClick
}: EmptyContentPanelProps) {
  return (
    <Card className={cardStyles.baseStyles}>
      <CardHeader className={`pb-2 ${cardStyles.gradientHeader}`}>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="mt-1">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 mb-4 rounded-full bg-blue-50 flex items-center justify-center">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium mb-1">{emptyMessage}</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md text-center">
          {emptyDescription}
        </p>
        <Button 
          variant="outline" 
          className={buttonStyles.outlineHover}
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}