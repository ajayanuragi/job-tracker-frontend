import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface PageErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

function PageError({
  title = "Something went wrong",
  message = "Unable to load data. Please try again.",
  onRetry,
}: PageErrorProps) {
  return (
    <Alert variant="destructive">
      <AlertTitle>{title}</AlertTitle>

      <AlertDescription className="space-y-3">
        <p>{message}</p>

        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

export default PageError;
