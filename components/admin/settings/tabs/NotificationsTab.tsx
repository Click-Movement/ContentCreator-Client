import React from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Bell, Mail, Save, Check } from 'lucide-react';
import BorderedToggleItem from '../BorderedToggleItem';
import InputWithIcon from '../InputWithIcon';

type NotificationsTabProps = {
  saveStatus: Record<string, boolean>;
  handleSave: (section: string) => void;
};

export default function NotificationsTab({ saveStatus, handleSave }: NotificationsTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-amber-100 shadow-lg">
        <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-amber-600"></div>
        <CardHeader className="bg-gradient-to-r from-amber-50 to-white pb-4 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-amber-100 text-amber-600">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-amber-900">Notification Settings</CardTitle>
              <CardDescription className="text-amber-700">
                Configure email notifications and alerts
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <BorderedToggleItem
                id="new-user-notification"
                label="New User Registration"
                description="Receive notifications when a new user registers"
                color="amber"
                defaultChecked={true}
              />
              
              <BorderedToggleItem
                id="payment-notification"
                label="Payment Received"
                description="Receive notifications for new payments"
                color="amber"
                defaultChecked={true}
              />
            </div>

            <div className="space-y-5">
              <BorderedToggleItem
                id="support-notification"
                label="Support Requests"
                description="Receive notifications for new support requests"
                color="amber"
                defaultChecked={true}
              />
              
              <BorderedToggleItem
                id="system-notification"
                label="System Alerts"
                description="Receive notifications for system events and errors"
                color="amber"
                defaultChecked={true}
              />
            </div>
          </div>
          
          <div className="p-5 rounded-lg border border-amber-200 bg-amber-50 mt-6">
            <h3 className="font-medium text-amber-800 mb-3">Notification Delivery</h3>
            <div className="space-y-4">
              <InputWithIcon
                id="notification-email"
                label="Notification Email"
                placeholder="admin@contentcreator.app"
                defaultValue="admin@contentcreator.app"
                icon={Mail}
                color="amber"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="email-notifications"
                    defaultChecked
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <Label htmlFor="email-notifications" className="text-sm text-amber-800">
                    Email
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sms-notifications"
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <Label htmlFor="sms-notifications" className="text-sm text-amber-800">
                    SMS
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="browser-notifications"
                    defaultChecked
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <Label htmlFor="browser-notifications" className="text-sm text-amber-800">
                    Browser
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="slack-notifications"
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <Label htmlFor="slack-notifications" className="text-sm text-amber-800">
                    Slack
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Last updated: June 6, 2025
          </span>
          <Button 
            onClick={() => handleSave('notifications')}
            className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white border-none shadow-sm flex items-center gap-2 transition-all duration-300"
          >
            {saveStatus['notifications'] ? (
              <>
                <Check className="h-4 w-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}