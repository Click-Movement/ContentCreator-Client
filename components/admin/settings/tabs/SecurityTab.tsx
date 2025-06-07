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
import { Shield, Save, Check } from 'lucide-react';
import BorderedToggleItem from '../BorderedToggleItem';
import SelectWithIcon from '../SelectWithIcon';
import ToggleItem from '../toggle-item';

type SecurityTabProps = {
  saveStatus: Record<string, boolean>;
  handleSave: (section: string) => void;
};

export default function SecurityTab({ saveStatus, handleSave }: SecurityTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-green-100 shadow-lg">
        <div className="h-1 w-full bg-gradient-to-r from-green-400 to-green-600"></div>
        <CardHeader className="bg-gradient-to-r from-green-50 to-white pb-4 border-b border-green-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-green-100 text-green-600">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-green-900">Security Settings</CardTitle>
              <CardDescription className="text-green-700">
                Configure security and access controls
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BorderedToggleItem
              id="two-factor-auth"
              label="Two-Factor Authentication"
              description="Require two-factor authentication for admin users"
              color="green"
              defaultChecked={true}
            />
            
            <BorderedToggleItem
              id="session-timeout"
              label="Session Timeout"
              description="Automatically log out inactive users after 30 minutes"
              color="green"
              defaultChecked={true}
            />
          </div>
          
          <div className="p-5 rounded-lg border border-green-200 bg-green-50">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-medium text-green-800">Security Policies</h3>
            </div>
            
            <div className="space-y-4">
              <SelectWithIcon
                id="password-policy"
                label="Password Policy"
                defaultValue="strong"
                options={[
                  { value: "basic", label: "Basic (8+ characters)" },
                  { value: "moderate", label: "Moderate (8+ chars, mixed case)" },
                  { value: "strong", label: "Strong (8+ chars, mixed case, numbers)" },
                  { value: "very-strong", label: "Very Strong (12+ chars, mixed case, numbers, special chars)" }
                ]}
                color="green"
              />
              
              <SelectWithIcon
                id="login-attempts"
                label="Failed Login Attempts Before Lockout"
                defaultValue="5"
                options={[
                  { value: "3", label: "3 attempts" },
                  { value: "5", label: "5 attempts" },
                  { value: "10", label: "10 attempts" }
                ]}
                color="green"
              />
              
              <SelectWithIcon
                id="session-duration"
                label="Session Duration"
                defaultValue="30"
                options={[
                  { value: "15", label: "15 minutes" },
                  { value: "30", label: "30 minutes" },
                  { value: "60", label: "1 hour" },
                  { value: "120", label: "2 hours" },
                  { value: "240", label: "4 hours" }
                ]}
                color="green"
              />
              
              <div className="flex items-center justify-between pt-3 border-t border-green-200">
                <div>
                  <Label htmlFor="ip-restriction" className="text-sm font-medium text-green-800">
                    IP Restrictions
                  </Label>
                  <p className="text-xs text-green-600">
                    Restrict admin access to specific IP addresses
                  </p>
                </div>
                <ToggleItem
                  id="ip-restriction"
                  label="IP Restrictions"
                  description="Restrict admin access to specific IP addresses"
                  color="green"
                  className="hidden"
                />
              </div>
            </div>
          </div>
          
          <div className="p-5 rounded-lg border border-green-200 bg-green-50">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-medium text-green-800">Audit & Compliance</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="audit-trail" className="text-sm font-medium text-green-800">
                    Activity Audit Trail
                  </Label>
                  <p className="text-xs text-green-600">
                    Record all admin activities for security purposes
                  </p>
                </div>
                <ToggleItem
                  id="audit-trail"
                  label="Activity Audit Trail"
                  description="Record all admin activities for security purposes"
                  color="green"
                  defaultChecked={true}
                  className="hidden"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="data-encryption" className="text-sm font-medium text-green-800">
                    Data Encryption
                  </Label>
                  <p className="text-xs text-green-600">
                    Enable end-to-end encryption for sensitive data
                  </p>
                </div>
                <ToggleItem
                  id="data-encryption"
                  label="Data Encryption"
                  description="Enable end-to-end encryption for sensitive data"
                  color="green"
                  defaultChecked={true}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Last updated: June 5, 2025
          </span>
          <Button 
            onClick={() => handleSave('security')}
            className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white border-none shadow-sm flex items-center gap-2 transition-all duration-300"
          >
            {saveStatus['security'] ? (
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