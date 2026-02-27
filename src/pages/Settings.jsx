import { Settings as SettingsIcon, User, Bell, Shield, Palette } from 'lucide-react';
import { PageHeader } from '@/components/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Settings = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings"
        subtitle="Manage your account and application preferences"
      />

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Profile Settings</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-xs uppercase">Full Name</Label>
                <p className="font-medium mt-1">Admin User</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs uppercase">Email</Label>
                <p className="font-medium mt-1">admin@company.com</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs uppercase">Role</Label>
                <p className="font-medium mt-1">Administrator</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs uppercase">Department</Label>
                <p className="font-medium mt-1">Human Resources</p>
              </div>
            </div>
            <Separator />
            <Button variant="outline">Edit Profile</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Bell className="w-5 h-5 text-warning" />
              </div>
              <div>
                <CardTitle className="text-lg">Notifications</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <SettingToggle
              label="Email Notifications"
              description="Receive email alerts for important updates"
              defaultChecked={true}
            />
            <SettingToggle
              label="Leave Request Alerts"
              description="Get notified when employees submit leave requests"
              defaultChecked={true}
            />
            <SettingToggle
              label="Performance Review Reminders"
              description="Reminders for upcoming performance reviews"
              defaultChecked={false}
            />
            <SettingToggle
              label="Attendance Alerts"
              description="Daily attendance summary notifications"
              defaultChecked={false}
            />
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Shield className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-lg">Security</CardTitle>
                <CardDescription>Manage your account security settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <SettingToggle
              label="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
              defaultChecked={false}
            />
            <SettingToggle
              label="Session Timeout"
              description="Automatically log out after 30 minutes of inactivity"
              defaultChecked={true}
            />
            <Separator />
            <Button variant="outline">Change Password</Button>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Palette className="w-5 h-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the application</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <SettingToggle
              label="Compact Mode"
              description="Use a more condensed layout for tables and lists"
              defaultChecked={false}
            />
            <SettingToggle
              label="Show Animations"
              description="Enable smooth transitions and animations"
              defaultChecked={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Converted SettingToggle component to JavaScript
const SettingToggle = ({ label, description, defaultChecked = false }) => (
  <div className="flex items-center justify-between">
    <div className="space-y-0.5">
      <Label className="font-medium">{label}</Label>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <Switch defaultChecked={defaultChecked} />
  </div>
);

export default Settings;
