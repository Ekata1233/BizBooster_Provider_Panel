// "use client";
// import Checkbox from "@/components/form/input/Checkbox";
// import Input from "@/components/form/input/InputField";
// import Label from "@/components/form/Label";
// import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
// import Link from "next/link";
// import React, { useState } from "react";

// export default function SignUpForm() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);
//   return (
//     <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar mb-5">
//       <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
//         <Link
//           href="/"
//           className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
//         >
//           <ChevronLeftIcon />
//           Back to dashboard
//         </Link>
//       </div>
//       <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
//         <div>
//           <div className="mb-5 sm:mb-8">
//             <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
//               Sign Up
//             </h1>
//             {/* <p className="text-sm text-gray-500 dark:text-gray-400">
//               Enter your email and password to sign up!
//             </p> */}
//           </div>

//           <div>

//             <form>
//               <div className="space-y-5">
//                 <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
//                   {/* <!-- First Name --> */}
//                   <div className="sm:col-span-1">
//                     <Label>
//                       First Name<span className="text-error-500">*</span>
//                     </Label>
//                     <Input
//                       type="text"
//                       id="fname"
//                       name="fname"
//                       placeholder="Enter your first name"
//                     />
//                   </div>
//                   {/* <!-- Last Name --> */}
//                   <div className="sm:col-span-1">
//                     <Label>
//                       Last Name<span className="text-error-500">*</span>
//                     </Label>
//                     <Input
//                       type="text"
//                       id="lname"
//                       name="lname"
//                       placeholder="Enter your last name"
//                     />
//                   </div>
//                 </div>
//                 {/* <!-- Email --> */}
//                 <div>
//                   <Label>
//                     Email<span className="text-error-500">*</span>
//                   </Label>
//                   <Input
//                     type="email"
//                     id="email"
//                     name="email"
//                     placeholder="Enter your email"
//                   />
//                 </div>
//                 {/* <!-- Password --> */}
//                 <div>
//                   <Label>
//                     Password<span className="text-error-500">*</span>
//                   </Label>
//                   <div className="relative">
//                     <Input
//                       placeholder="Enter your password"
//                       type={showPassword ? "text" : "password"}
//                     />
//                     <span
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
//                     >
//                       {showPassword ? (
//                         <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
//                       ) : (
//                         <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
//                       )}
//                     </span>
//                   </div>
//                 </div>
//                 {/* <!-- Checkbox --> */}
//                 <div className="flex items-center gap-3">
//                   <Checkbox
//                     className="w-5 h-5"
//                     checked={isChecked}
//                     onChange={setIsChecked}
//                   />
//                   <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
//                     By creating an account means you agree to the{" "}
//                     <span className="text-gray-800 dark:text-white/90">
//                       Terms and Conditions,
//                     </span>{" "}
//                     and our{" "}
//                     <span className="text-gray-800 dark:text-white">
//                       Privacy Policy
//                     </span>
//                   </p>
//                 </div>
//                 {/* <!-- Button --> */}
//                 <div>
//                   <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
//                     Sign Up
//                   </button>
//                 </div>
//               </div>
//             </form>

//             <div className="mt-5">
//               <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
//                 Already have an account?
//                 <Link
//                   href="/signin"
//                   className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
//                 >
//                   Sign In
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProvider } from '@/context/ProviderContext';
import { CheckCircleIcon, ChevronLeftIcon } from '@/icons';
import Link from 'next/link';
import { Check, ArrowRightIcon, Clock } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  VISUAL STEPPER                                                    */
/* ------------------------------------------------------------------ */
function Stepper({ storeDone, kycDone }: { storeDone: boolean; kycDone: boolean }) {
  const currentStep = storeDone ? (kycDone ? 'done' : 3) : (storeDone ? 2 : 1);
  
  const items = [
    { step: 1, label: 'Registration', done: true },
    { step: 2, label: 'Store Info', done: storeDone },
    { step: 3, label: 'KYC Uploads', done: kycDone },
  ];

  const icon = (step: number, done: boolean) => {
    if (done) return <Check className="h-4 w-4" />;
    if (step === currentStep) return <ArrowRightIcon className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  return (
    <div className="flex justify-between mb-6">
      {items.map(({ step, label, done }) => {
        const active = step === currentStep;
        return (
          <div key={step} className="flex-1 text-center">
            <div
              className={`mx-auto h-8 w-8 rounded-full flex items-center justify-center
                ${done ? 'bg-green-600 text-white' :
                  active ? 'bg-blue-600 text-white' :
                  'bg-gray-300 text-gray-700'}`}
            >
              {icon(step, done)}
            </div>
            <p className={`mt-1 text-sm ${done ? 'text-green-700' :
              active ? 'text-blue-700' : 'text-gray-500'}`}
            >
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                              */
/* ------------------------------------------------------------------ */
export default function ProviderOnboardingPage() {
  const {
    provider,
    loading,
    error,
    registerProvider,
    updateStoreInfo,
    updateKycInfo,
  } = useProvider();
  const [isChecked, setIsChecked] = useState(false);

  const regForm = useForm();
  const storeForm = useForm();
  const kycForm = useForm();

  const onRegister = async (data: any) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));
    await registerProvider(fd);
    regForm.reset();
  };

  const onStoreSave = async (data: any) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v instanceof FileList) {
        Array.from(v).forEach((file) => fd.append(k, file));
      } else {
        fd.append(k, v as any);
      }
    });
    await updateStoreInfo(fd);
    storeForm.reset();
  };

  const onKycSave = async (data: any) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v instanceof FileList) {
        Array.from(v).forEach((file) => fd.append(k, file));
      } else {
        fd.append(k, v as any);
      }
    });
    await updateKycInfo(fd);
    kycForm.reset();
  };

  const storeDone = !!provider?.storeInfoCompleted;
  const kycDone = !!provider?.kycCompleted;

  if (loading && !provider) return <p className="py-10 text-center">Loading…</p>;

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar mb-5">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-3 sm:mb-8">
            <h1 className=" font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
          </div>

          <section className="mx-auto max-w-2xl px-4 py-8">
            <Stepper storeDone={storeDone} kycDone={kycDone} />

            {/* ---------------- STEP 1 ---------------- */}
            {!provider && (
              <form onSubmit={regForm.handleSubmit(onRegister)} className="space-y-6">
                <h2 className="text-xl font-semibold text-blue-700 mb-4">Step 1 • Registration</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Full Name</label>
                    <input
                      {...regForm.register('fullName')}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Email</label>
                    <input
                      {...regForm.register('email')}
                      required
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Phone No</label>
                    <input
                      {...regForm.register('phoneNo')}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Password</label>
                    <input
                      {...regForm.register('password')}
                      required
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
                    <input
                      {...regForm.register('confirmPassword')}
                      required
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-8 py-3 rounded text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-800 disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? 'Submitting…' : 'Register'}
                  </button>
                </div>
              </form>
            )}


            {/* STEP 2 BANNER */}
            {provider && !storeDone && (
              <p className="mb-8 rounded-lg bg-emerald-50 p-4 text-center text-emerald-800">
                ✅ Registration completed. Please fill in your Store Information next.
              </p>
            )}

            {/* ---------------- STEP 2 ---------------- */}
            {provider && !storeDone && (
              <form onSubmit={storeForm.handleSubmit(onStoreSave)} className="space-y-6">
                <h2 className="text-xl font-semibold text-blue-700 mb-4">Step 2 • Store Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Store Name</label>
                    <input
                      {...storeForm.register('storeName')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Store Phone</label>
                    <input
                      {...storeForm.register('storePhone')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Store Email</label>
                    <input
                      {...storeForm.register('storeEmail')}
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Address</label>
                    <input
                      {...storeForm.register('address')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">City</label>
                    <input
                      {...storeForm.register('city')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">State</label>
                    <input
                      {...storeForm.register('state')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Country</label>
                    <input
                      {...storeForm.register('country')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Logo</label>
                    <input
                      {...storeForm.register('logo')}
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Cover</label>
                    <input
                      {...storeForm.register('cover')}
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-8 py-3 rounded text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-800 disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? 'Saving…' : 'Save Store Info'}
                  </button>
                </div>
              </form>
            )}

            {/* ---------------- STEP 3 ---------------- */}
            {provider && storeDone && !kycDone && (
              <form onSubmit={kycForm.handleSubmit(onKycSave)} className="space-y-6">
                <h2 className="text-xl font-semibold text-blue-700 mb-4">Step 3 • KYC Documents</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Aadhaar (up to 2)</label>
                    <input
                      {...kycForm.register('aadhaarCard')}
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">PAN Card</label>
                    <input
                      {...kycForm.register('panCard')}
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Store Docs</label>
                    <input
                      {...kycForm.register('storeDocument')}
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">GST Certificates</label>
                    <input
                      {...kycForm.register('GST')}
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Other Docs</label>
                    <input
                      {...kycForm.register('other')}
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-8 py-3 rounded text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-800 disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? 'Uploading…' : 'Submit KYC'}
                  </button>
                </div>
              </form>

            )}

            {/* ---------------- DONE ---------------- */}
            {provider && storeDone && kycDone && (
              <div className="text-center py-20">
                <Check className="mx-auto h-16 w-16 text-blue-600 mb-4" />
                <h2 className="text-2xl font-semibold text-blue-700">
                  All steps completed!
                </h2>
                <p className="text-blue-600 mt-2">
                  🎉 All steps completed — your account is under review. We'll notify
                  you once everything is verified.
                </p>
              </div>
            )}

          </section>

        </div>
      </div>
    </div>
  );
}
