import React from 'react';
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { Shield, ArrowRight, CheckCircle, Lock } from 'lucide-react';

interface AuthScreenProps {
  onAuthenticated?: (email: string) => void;
  onCancel: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onCancel }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/50 to-purple-100/50 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden relative z-10">
        {/* Header */}
        <div className="px-8 pt-10 pb-6 text-center">
            <div className="w-12 h-12 bg-zinc-900 text-white rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-zinc-200">
                <span className="font-bold font-serif italic text-xl">D</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-2">
                Start your 3-day free trial
            </h2>
            <p className="text-zinc-500 text-sm">
                No credit card required. Cancel anytime.
            </p>
        </div>

        {/* Auth */}
        <div className="px-8 pb-10 space-y-5">
            <SignedOut>
                <SignUpButton mode="modal">
                    <button
                        className="w-full py-4 bg-zinc-900 hover:bg-black text-white rounded-xl font-bold text-sm shadow-xl shadow-zinc-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                        Create Free Account
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </SignUpButton>

                <SignInButton mode="modal">
                    <button
                        className="w-full py-4 bg-white hover:bg-zinc-50 text-zinc-900 rounded-xl font-bold text-sm border border-zinc-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                        Log In
                    </button>
                </SignInButton>
            </SignedOut>

            <SignedIn>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-emerald-900 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium">You’re signed in. You can close this window.</span>
                </div>
            </SignedIn>

            {/* Social Proof / Security */}
            <div className="pt-4 border-t border-zinc-100">
                <div className="flex items-center justify-center gap-6 text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                        <Shield className="w-3 h-3 text-green-500" />
                        Secure Encryption
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-zinc-400" />
                        Privacy First
                    </span>
                </div>
            </div>
        </div>
        
        <button 
            onClick={onCancel}
            className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 transition-colors"
        >
            Close
        </button>
      </div>
    </div>
  );
};

export default AuthScreen;