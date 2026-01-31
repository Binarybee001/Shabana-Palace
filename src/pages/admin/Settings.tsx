import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Save, User, Mail, Plus, Trash2, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Schema for updating current admin
const updateSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters").optional().or(z.literal("")),
  confirmPassword: z.string().optional().or(z.literal("")),
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Schema for creating new admin
const createAdminSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UpdateFormValues = z.infer<typeof updateSchema>;
type CreateAdminFormValues = z.infer<typeof createAdminSchema>;

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

export default function AdminSettingsPage() {
  const [showPasswords, setShowPasswords] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [allAdmins, setAllAdmins] = useState<AdminUser[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const updateForm = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const createAdminForm = useForm<CreateAdminFormValues>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // Load current user
  useEffect(() => {
    const loadCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser({
          id: user.id,
          email: user.email || "",
          created_at: user.created_at,
        });
        updateForm.setValue("email", user.email || "");
      }
    };
    loadCurrentUser();
  }, [updateForm]);

  // Load all admin users
  const loadAllAdmins = async () => {
    try {
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        console.error("Error loading admins:", error);
        return;
      }

      if (users) {
        setAllAdmins(users.map(u => ({
          id: u.id,
          email: u.email || "",
          created_at: u.created_at,
        })));
      }
    } catch (error) {
      console.error("Error loading admins:", error);
    }
  };

  useEffect(() => {
    loadAllAdmins();
  }, []);

  const handleUpdateAccount = async (values: UpdateFormValues) => {
    try {
      // First verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentUser?.email || "",
        password: values.currentPassword,
      });

      if (signInError) {
        updateForm.setError("currentPassword", { message: "Current password is incorrect" });
        return;
      }

      // Update email if changed
      if (values.email !== currentUser?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: values.email,
        });

        if (emailError) {
          toast.error("Failed to update email: " + emailError.message);
          return;
        }
      }

      // Update password if provided
      if (values.newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: values.newPassword,
        });

        if (passwordError) {
          toast.error("Failed to update password: " + passwordError.message);
          return;
        }
      }

      toast.success("Account updated successfully! You may need to verify your new email.");
      updateForm.reset({
        email: values.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Reload current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser({
          id: user.id,
          email: user.email || "",
          created_at: user.created_at,
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("An error occurred while updating your account");
    }
  };

  const handleCreateAdmin = async (values: CreateAdminFormValues) => {
  setIsCreating(true);
  try {
    // Create the user account
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      }
    });

    if (error) {
      toast.error("Failed to create admin: " + error.message);
      return;
    }

    if (data.user) {
      // Add admin role to the new user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      const { error: roleError } = await supabase
        .from('admin_roles')
        .insert({
          user_id: data.user.id,
          role: 'admin',
          created_by: currentUser?.id
        });

      if (roleError) {
        console.error('Error creating admin role:', roleError);
        toast.error("Admin account created but failed to assign admin role");
        return;
      }

      toast.success(`Admin account created for ${values.email}! They need to verify their email to login.`);
    }
    
    setIsCreateDialogOpen(false);
    createAdminForm.reset();
  } catch (error) {
    console.error("Create admin error:", error);
    toast.error("An error occurred while creating admin account");
  } finally {
    setIsCreating(false);
  }
};
  
  const handleDeleteAdmin = async (userId: string, email: string) => {
    if (userId === currentUser?.id) {
      toast.error("You cannot delete your own account");
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        toast.error("Failed to delete admin: " + error.message);
        return;
      }

      toast.success(`Admin ${email} deleted successfully`);
      setDeleteUserId(null);
      
      // Reload admin list
      await loadAllAdmins();
    } catch (error) {
      console.error("Delete admin error:", error);
      toast.error("An error occurred while deleting admin");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold">Settings</h1>
        <p className="text-muted-foreground">Manage your admin account and create new admins.</p>
      </div>

      {/* Update Account Card */}
      <Card className="rounded-2xl shadow-card max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Your Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={updateForm.handleSubmit(handleUpdateAccount)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="rounded-xl h-12 pl-10"
                  placeholder="admin@shabana.com"
                  {...updateForm.register("email")}
                />
              </div>
              {updateForm.formState.errors.email?.message && (
                <p className="text-sm text-destructive">{updateForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="currentPassword"
                  type={showPasswords ? "text" : "password"}
                  className="rounded-xl h-12 pl-10 pr-10"
                  placeholder="Enter current password"
                  {...updateForm.register("currentPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {updateForm.formState.errors.currentPassword?.message && (
                <p className="text-sm text-destructive">{updateForm.formState.errors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password (optional)</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showPasswords ? "text" : "password"}
                  className="rounded-xl h-12 pl-10"
                  placeholder="Leave blank to keep current"
                  {...updateForm.register("newPassword")}
                />
              </div>
              {updateForm.formState.errors.newPassword?.message && (
                <p className="text-sm text-destructive">{updateForm.formState.errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPasswords ? "text" : "password"}
                  className="rounded-xl h-12 pl-10"
                  placeholder="Confirm new password"
                  {...updateForm.register("confirmPassword")}
                />
              </div>
              {updateForm.formState.errors.confirmPassword?.message && (
                <p className="text-sm text-destructive">{updateForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" className="rounded-xl">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Admin Management Card */}
      <Card className="rounded-2xl shadow-card max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Manage Admins
            </CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Admin</DialogTitle>
                  <DialogDescription>
                    Add a new administrator account to manage Shabana Palace.
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={createAdminForm.handleSubmit(handleCreateAdmin)}>
                  <div className="space-y-2">
                    <Label htmlFor="newAdminEmail">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newAdminEmail"
                        type="email"
                        className="rounded-xl h-12 pl-10"
                        placeholder="newadmin@shabana.com"
                        {...createAdminForm.register("email")}
                      />
                    </div>
                    {createAdminForm.formState.errors.email?.message && (
                      <p className="text-sm text-destructive">{createAdminForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newAdminPassword">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newAdminPassword"
                        type="password"
                        className="rounded-xl h-12 pl-10"
                        placeholder="Enter password"
                        {...createAdminForm.register("password")}
                      />
                    </div>
                    {createAdminForm.formState.errors.password?.message && (
                      <p className="text-sm text-destructive">{createAdminForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newAdminConfirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newAdminConfirmPassword"
                        type="password"
                        className="rounded-xl h-12 pl-10"
                        placeholder="Confirm password"
                        {...createAdminForm.register("confirmPassword")}
                      />
                    </div>
                    {createAdminForm.formState.errors.confirmPassword?.message && (
                      <p className="text-sm text-destructive">{createAdminForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="rounded-xl" disabled={isCreating}>
                      {isCreating ? "Creating..." : "Create Admin"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {allAdmins.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No admins found</p>
            ) : (
              allAdmins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{admin.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {admin.id === currentUser?.id ? "(You)" : `Created ${new Date(admin.created_at).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  {admin.id !== currentUser?.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteUserId(admin.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this admin account. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive hover:bg-destructive/90"
              onClick={() => {
                const admin = allAdmins.find(a => a.id === deleteUserId);
                if (admin && deleteUserId) {
                  handleDeleteAdmin(deleteUserId, admin.email);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}