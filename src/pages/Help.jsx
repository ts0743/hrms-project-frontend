import { HelpCircle, BookOpen, MessageSquare, Mail, ExternalLink } from 'lucide-react';
import { PageHeader } from '@/components/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const Help = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Help & Support"
        subtitle="Find answers to common questions and get support"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="card-interactive">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Documentation</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Browse our comprehensive documentation
                  </p>
                  <Button variant="outline" size="sm" className="gap-2">
                    View Docs <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-interactive">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <MessageSquare className="w-6 h-6 text-success" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Live Chat</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Chat with our support team
                  </p>
                  <Button variant="outline" size="sm" className="gap-2">
                    Start Chat <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-interactive">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Email Support</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Send us an email for assistance
                  </p>
                  <Button variant="outline" size="sm" className="gap-2">
                    Contact Us <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
                <CardDescription>Find quick answers to common questions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I add a new employee?</AccordionTrigger>
                <AccordionContent>
                  Navigate to the Employees section from the sidebar and click the "Add Employee" button. 
                  Fill in the required information such as name, email, department, and designation, 
                  then click Save to create the employee record.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How do I approve or reject leave requests?</AccordionTrigger>
                <AccordionContent>
                  Go to the Leave Management section. You'll see a list of all leave requests with their status. 
                  For pending requests, use the approve (✓) or reject (✗) buttons to process the request. 
                  You can also filter by status to see only pending requests.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>How is the attendance rate calculated?</AccordionTrigger>
                <AccordionContent>
                  The attendance rate is calculated by dividing the number of days marked as Present or 
                  Work From Home by the total number of working days. Employees on approved leave are 
                  not counted as absent in this calculation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>How do I conduct a performance review?</AccordionTrigger>
                <AccordionContent>
                  Navigate to the Performance section and click "Add Review". Select the employee, 
                  set their goals, provide a rating (Exceptional, Exceeds, Meets, Needs Improvement, 
                  or Unsatisfactory), add feedback, and save the review. Reviews are tied to specific 
                  dates and can be filtered by year.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Can I export attendance data?</AccordionTrigger>
                <AccordionContent>
                  Yes! In the Attendance section, click the "Export" button to download attendance 
                  records. You can filter by date range and employee before exporting to get exactly 
                  the data you need.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>How do I change my password?</AccordionTrigger>
                <AccordionContent>
                  Go to Settings from the sidebar, scroll to the Security section, and click 
                  "Change Password". You'll need to enter your current password and then your 
                  new password twice to confirm the change.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>What do the performance ratings mean?</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Exceptional:</strong> Consistently exceeds all expectations and delivers outstanding results</li>
                    <li><strong>Exceeds:</strong> Frequently surpasses expectations and contributes beyond requirements</li>
                    <li><strong>Meets:</strong> Successfully fulfills all job responsibilities and expectations</li>
                    <li><strong>Needs Improvement:</strong> Sometimes falls short of expectations and requires development</li>
                    <li><strong>Unsatisfactory:</strong> Consistently fails to meet minimum job requirements</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;
