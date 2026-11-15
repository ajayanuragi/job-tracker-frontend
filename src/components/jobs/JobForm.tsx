import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema, type JobFormValues } from "@/schemas/jobSchema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button'

interface JobFormProps {
  onSubmit: (data: JobFormValues) => void;
  isPending?: boolean;
}

function JobForm({ onSubmit, isPending = false }: JobFormProps) {
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      companyName: "",
      description: "",
      location: "",
      employmentType: "FULL_TIME",
      workplaceType: "REMOTE",
      jobUrl: "",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Job title</Label>
        <Input
          id="title"
          placeholder="e.g. Java Backend Developer"
          {...form.register("title")}
        />
        {form.formState.errors.title && (
          <p className="text-sm text-destructive">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyName">Company name</Label>
        <Input
          id="companyName"
          placeholder="e.g. Google"
          {...form.register("companyName")}
        />
        {form.formState.errors.companyName && (
          <p className="text-sm text-destructive">
            {form.formState.errors.companyName.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Job description</Label>
        <Textarea
          id="description"
          placeholder="Enter the job description..."
          rows={5}
          {...form.register("description")}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-destructive">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="e.g. Remote, India"
          {...form.register("location")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="employmentType">Employment type</Label>
        <select
          id="employmentType"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...form.register("employmentType")}
        >
          <option value="FULL_TIME">Full-time</option>
          <option value="PART_TIME">Part-time</option>
          <option value="CONTRACT">Contract</option>
          <option value="INTERNSHIP">Internship</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="workplaceType">Workplace type</Label>
        <select
          id="workplaceType"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...form.register("workplaceType")}
        >
          <option value="REMOTE">Remote</option>
          <option value="HYBRID">Hybrid</option>
          <option value="ONSITE">On-site</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="jobUrl">Job URL</Label>
        <Input
          id="jobUrl"
          type="url"
          placeholder="https://example.com/job"
          {...form.register("jobUrl")}
        />
        {form.formState.errors.jobUrl && (
          <p className="text-sm text-destructive">
            {form.formState.errors.jobUrl.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Saving...' : 'Save Job'}
      </Button>
    </form>
  );
}

export default JobForm;
