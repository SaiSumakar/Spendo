// apps/web/src/features/settings/SettingsPage.tsx
import { useState } from 'react';
import { 
  User, 
  Bell, 
  Wallet, 
  Shield, 
  Download, 
  Save,
  Monitor,
  LogOut
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { initialSettings } from './data/mockSettings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  // Simulation of an API call
  const handleSave = () => {
    setIsSaving(true);
    // Simulate network delay
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!"); // Replace with a toast notification in production
    }, 1000);
  };

  const menuItems = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Monitor },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Budget & Data', icon: Wallet },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-10">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="lg:w-1/5">
            <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 overflow-x-auto pb-2 lg:pb-0">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? 'secondary' : 'ghost'}
                  className={`justify-start gap-2 ${activeTab === item.id ? 'bg-secondary' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 lg:max-w-3xl space-y-6">
            
            {/* --- TAB: ACCOUNT --- */}
            {activeTab === 'account' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>This is how others will see you on the site.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <Avatar className="h-20 w-20 border">
                        <AvatarImage src={settings.profile.avatar} />
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                      <Button variant="outline">Change Avatar</Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input 
                        id="displayName"
                        defaultValue={settings.profile.name} 
                        onChange={(e) => setSettings({...settings, profile: {...settings.profile, name: e.target.value}})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue={settings.profile.email} disabled className="bg-muted text-muted-foreground" />
                      <p className="text-[0.8rem] text-muted-foreground">Email cannot be changed in demo mode.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* --- TAB: PREFERENCES --- */}
            {activeTab === 'preferences' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card>
                  <CardHeader>
                    <CardTitle>General Preferences</CardTitle>
                    <CardDescription>Customize your localized experience.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Base Currency</Label>
                        <Select 
                          defaultValue={settings.preferences.currency}
                          onValueChange={(val) => setSettings({...settings, preferences: {...settings.preferences, currency: val}})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="INR">INR (₹)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-[0.8rem] text-muted-foreground">Default for new subscriptions.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Language</Label>
                        <Select defaultValue="English">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Spanish">Spanish</SelectItem>
                            <SelectItem value="French">French</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <div className="flex gap-4 pt-2">
                        <div className="cursor-pointer border-2 border-primary rounded-md p-1">
                          <div className="bg-slate-950 w-24 h-16 rounded flex items-center justify-center text-white text-xs shadow-sm">Dark</div>
                        </div>
                        <div className="cursor-pointer border rounded-md p-1 opacity-50 hover:opacity-100 transition-opacity">
                          <div className="bg-white border w-24 h-16 rounded flex items-center justify-center text-black text-xs shadow-sm">Light</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* --- TAB: NOTIFICATIONS --- */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card>
                  <CardHeader>
                    <CardTitle>Alerts & Notifications</CardTitle>
                    <CardDescription>Configure how you want to be reminded about bills.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email Alerts</Label>
                        <p className="text-sm text-muted-foreground">Receive daily digests and bill reminders.</p>
                      </div>
                      <Switch 
                        checked={settings.notifications.emailAlerts}
                        onCheckedChange={(checked) => setSettings({...settings, notifications: {...settings.notifications, emailAlerts: checked}})}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive real-time alerts on your device.</p>
                      </div>
                      <Switch 
                        checked={settings.notifications.pushAlerts} 
                        onCheckedChange={(checked) => setSettings({...settings, notifications: {...settings.notifications, pushAlerts: checked}})}
                      />
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label>Reminder Timing</Label>
                        <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                          {settings.notifications.daysBeforeBill} days before
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="7" 
                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        defaultValue={settings.notifications.daysBeforeBill}
                        onChange={(e) => setSettings({...settings, notifications: {...settings.notifications, daysBeforeBill: parseInt(e.target.value)}})} 
                      />
                      <p className="text-[0.8rem] text-muted-foreground">We will alert you this many days before a bill triggers.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* --- TAB: BUDGET & DATA --- */}
            {activeTab === 'billing' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Settings</CardTitle>
                    <CardDescription>Set your limits and manage your data.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                       <Label>Monthly Budget Limit</Label>
                       <div className="relative">
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                         <Input 
                           type="number" 
                           className="pl-8 font-mono" 
                           defaultValue={settings.budget.monthlyLimit}
                           onChange={(e) => setSettings({...settings, budget: {...settings.budget, monthlyLimit: parseInt(e.target.value)}})}
                         />
                       </div>
                       <p className="text-[0.8rem] text-muted-foreground">Used to calculate your "Safe to Spend" metric on the dashboard.</p>
                    </div>

                    <Separator />
                    
                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center gap-2"><Download className="w-4 h-4"/> Export Data</h3>
                      <p className="text-sm text-muted-foreground">Download all your subscriptions and transactions as a CSV file.</p>
                      <Button variant="outline" className="mt-2 gap-2">
                        <Download className="w-4 h-4" /> Download .CSV
                      </Button>
                    </div>

                    <Separator />

                    <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10 dark:border-red-900">
                      <h3 className="font-medium text-red-600 flex items-center gap-2"><Shield className="w-4 h-4"/> Danger Zone</h3>
                      <p className="text-sm text-red-600/80 mt-1">Once you delete your account, there is no going back.</p>
                      <Button variant="destructive" className="mt-4 gap-2">
                        <LogOut className="w-4 h-4" /> Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Global Save Button */}
            <div className="flex justify-end pt-4 sticky bottom-4">
              <Button onClick={handleSave} disabled={isSaving} className="gap-2 shadow-lg w-full sm:w-auto">
                {isSaving ? (
                    <>
                        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        Saving...
                    </>
                ) : (
                    <>
                        <Save className="w-4 h-4" /> Save Changes
                    </>
                )}
              </Button>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}