'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProvider } from '@/context/ProviderContext';
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from '@/icons';
import Link from 'next/link';
import { Check, ArrowRightIcon, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/app/context/AuthContext';
import { useZone } from '@/app/context/ZoneContext';
import { useModule } from '@/app/context/ModuleContext';

/* ------------------------------------------------------------------ */
/*  VISUAL STEPPER                                                    */
/* ------------------------------------------------------------------ */
function Stepper({
  storeDone,
  kycDone,
  activeStep,
}: {
  storeDone: boolean;
  kycDone: boolean;
  activeStep: number;
}) {
  const items = [
    { step: 1, label: 'Registration', done: activeStep > 1 },
    { step: 2, label: 'Store Info', done: storeDone },
    { step: 3, label: 'KYC Uploads', done: kycDone },
  ];

  const icon = (step: number, done: boolean, isActive: boolean) => {
    if (done) return <Check className="h-4 w-4" />;
    if (isActive) return <ArrowRightIcon className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  return (
    <div className="flex justify-between mb-8">
      {items.map(({ step, label, done }) => {
        const isActive = step === activeStep;
        const isCompleted = done;

        return (
          <div key={step} className="flex-1 text-center">
            <div
              className={`mx-auto h-10 w-10 rounded-full flex items-center justify-center
                ${isCompleted ? 'bg-green-600 text-white' :
                  isActive ? 'bg-blue-600 text-white' :
                    'bg-gray-300 text-gray-700'}`}
            >
              {icon(step, isCompleted, isActive)}
            </div>
            <p className={`mt-2 text-sm ${isCompleted ? 'text-green-700' :
              isActive ? 'text-blue-700' : 'text-gray-500'}`}>
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

  const router = useRouter();
  const { providerDetails } = useAuth();

  const regForm = useForm();
  const storeForm = useForm();
  const kycForm = useForm();
  const [activeStep, setActiveStep] = useState<number>(1);
  const { zones } = useZone();
  const { modules } = useModule();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const providerId = providerDetails?._id as string | undefined;
  console.log("provider Id : ", providerId);

  // Auto-navigate to first incomplete step
  useEffect(() => {
    const fetchProvider = async () => {
      if (!providerId) {
        setActiveStep(1);
        return;
      }

      try {
        const res = await axios.get(`https://biz-booster.vercel.app/api/provider/${providerId}`);
        const p = res.data;

        if (!p) {
          setActiveStep(1);
          return;
        }

        if (!p.step1Completed) {
          setActiveStep(1);
        } else if (p.step1Completed && !p.storeInfoCompleted) {
          setActiveStep(2);
        } else if (p.step1Completed && p.storeInfoCompleted && !p.kycCompleted) {
          setActiveStep(3);
        } else {
          setActiveStep(3);
        }
      } catch (err) {
        console.error('Failed to fetch provider:', err);
        setActiveStep(1);
      }
    };

    fetchProvider();
  }, [providerId]);

  const onRegister = async (data: Record<string, FormDataEntryValue | Blob>) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));
    await registerProvider(fd);
    regForm.reset();
    setActiveStep(2);
  };

  const onStoreSave = async (data: Record<string, FormDataEntryValue | FileList>) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v instanceof FileList) {
        Array.from(v).forEach((file) => fd.append(k, file));
      } else {
        fd.append(k, v);
      }
    });
    await updateStoreInfo(fd);
    storeForm.reset();
    setActiveStep(3);
  };

  const onKycSave = async (data: Record<string, FormDataEntryValue | FileList>) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v instanceof FileList) {
        Array.from(v).forEach((file) => fd.append(k, file));
      } else {
        fd.append(k, v as string);
      }
    });

    await updateKycInfo(fd);
    kycForm.reset();

    setTimeout(() => {
      router.push("/");
    }, 3000);
  };

  const storeDone = !!provider?.storeInfoCompleted;
  const kycDone = !!provider?.kycCompleted;

  if (loading && !provider) return <p className="py-10 text-center">Loading…</p>;

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto no-scrollbar mb-10">
      <div className="w-full max-w-6xl sm:pt-10 mx-auto mb-6 px-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-6xl mx-auto px-6">
        <div>
          <div className="flex justify-center bg-gray-50 dark:bg-gray-900 py-16">
            <div className="text-center">
              <h1 className="font-bold text-gray-800 text-4xl md:text-5xl dark:text-white/90 mb-4">
                Sign Up
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Create your account to get started 🚀
              </p>
              <div className="mt-6 w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </div>
          </div>


          <section className="mx-auto max-w-5xl px-8 py-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <Stepper storeDone={storeDone} kycDone={kycDone} activeStep={activeStep} />

            {/* ---------------- STEP 1 ---------------- */}
            {activeStep === 1 && (
              <form onSubmit={regForm.handleSubmit(onRegister)} className="space-y-8">
                <h2 className="text-xl font-semibold text-blue-700 mb-6">Step 1 • Registration</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Full Name</label>
                    <input
                      {...regForm.register('fullName')}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Email</label>
                    <input
                      {...regForm.register('email')}
                      required
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {/* Phone */}
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Phone No</label>
                    <input
                      {...regForm.register('phoneNo')}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {/* Password */}
                  <div className="relative">
                    <label className="block mb-1 font-medium text-gray-700">Password</label>
                    <input
                      {...regForm.register('password')}
                      required
                      type={showPassword ? "text" : "password"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-12 right-0 flex items-center pr-3 text-gray-500"
                    >
                      {showPassword ? <EyeCloseIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                  {/* Confirm Password */}
                  <div className="relative">
                    <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
                    <input
                      {...regForm.register('confirmPassword')}
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-12 right-0 flex items-center pr-3 text-gray-500"
                    >
                      {showConfirmPassword ? <EyeCloseIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="flex justify-end mt-8">
                  <button
                    type="submit"
                    className="px-10 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-800 shadow-md hover:shadow-lg disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? 'Submitting…' : 'Register'}
                  </button>
                </div>
              </form>
            )}

            {/* ---------------- STEP 2 ---------------- */}
            {activeStep === 2 && (
              <>
                {provider && !storeDone && (
                  <div className="mb-6 rounded-lg bg-green-50 p-4 text-center text-green-800">
                    ✅ Registration completed. Please fill in your Store Information next.
                  </div>
                )}
                <form onSubmit={storeForm.handleSubmit(onStoreSave)} className="space-y-8">
                  <h2 className="text-xl font-semibold text-blue-700 mb-6">Step 2 • Store Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Store fields remain unchanged */}
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Store Name</label>
                      <input {...storeForm.register('storeName')} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Store Phone</label>
                      <input {...storeForm.register('storePhone')} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Store Email</label>
                      <input {...storeForm.register('storeEmail')} type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    {/* Module Dropdown */}
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Select Module</label>
                      <select {...storeForm.register("moduleId", { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select Module</option>
                        {modules?.map((m) => (
                          <option key={m._id} value={m._id}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                    {/* Zone Dropdown */}
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Select Zone</label>
                      <select {...storeForm.register("zoneId", { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select Zone</option>
                        {zones?.map((z) => (
                          <option key={z._id} value={z._id}>{z.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Address</label>
                      <input {...storeForm.register('address')} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">City</label>
                      <input {...storeForm.register('city')} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">State</label>
                      <input {...storeForm.register('state')} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Country</label>
                      <input {...storeForm.register('country')} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Logo</label>
                      <input {...storeForm.register('logo')} type="file" accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Cover</label>
                      <input {...storeForm.register('cover')} type="file" accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                  <div className="flex justify-end mt-8">
                    <button
                      type="submit"
                      className="px-10 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-800 shadow-md hover:shadow-lg disabled:opacity-60"
                      disabled={loading}
                    >
                      {loading ? 'Saving…' : 'Save Store Info'}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* ---------------- STEP 3 ---------------- */}
           {/* ---------------- STEP 3 ---------------- */}
{activeStep === 3 && (
  <>
    {provider && storeDone && !kycDone && (
      <div className="mb-6 rounded-lg bg-green-50 p-4 text-center text-green-800">
        ✅ Store information completed. Please upload your KYC documents.
      </div>
    )}

    {!kycDone ? (
      <form onSubmit={kycForm.handleSubmit(onKycSave)} className="space-y-6">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Step 3 • KYC Documents</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Aadhaar - REQUIRED */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Aadhaar (up to 2) <span className="text-red-500">*</span>
            </label>
            <input
              {...kycForm.register("aadhaarCard", {
                required: "Aadhaar card is required",
              })}
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
            {kycForm.formState.errors.aadhaarCard && (
              <p className="text-red-500 text-sm mt-1">
                {kycForm.formState.errors.aadhaarCard.message as string}
              </p>
            )}
          </div>

          {/* PAN - REQUIRED */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              PAN Card <span className="text-red-500">*</span>
            </label>
            <input
              {...kycForm.register("panCard", {
                required: "PAN card is required",
              })}
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
            {kycForm.formState.errors.panCard && (
              <p className="text-red-500 text-sm mt-1">
                {kycForm.formState.errors.panCard.message as string}
              </p>
            )}
          </div>

          {/* Store Document - REQUIRED */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Store Document <span className="text-red-500">*</span>
            </label>
            <input
              {...kycForm.register("storeDocument", {
                required: "Store document is required",
              })}
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
            {kycForm.formState.errors.storeDocument && (
              <p className="text-red-500 text-sm mt-1">
                {kycForm.formState.errors.storeDocument.message as string}
              </p>
            )}
          </div>

          {/* GST - Optional */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">GST Certificates</label>
            <input
              {...kycForm.register("GST")}
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

          {/* Other Docs - Optional */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Other Docs</label>
            <input
              {...kycForm.register("other")}
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
            {loading ? "Uploading…" : "Submit KYC"}
          </button>
        </div>
      </form>
    ) : (
      <div className="text-center py-20">
        <Check className="mx-auto h-16 w-16 text-green-600 mb-4" />
        <h2 className="text-2xl font-semibold text-green-700">
          All steps completed!
        </h2>
        <p className="text-gray-600 mt-2">
          🎉 All steps completed — your account is under review. We&apos;ll notify
          you once everything is verified.
        </p>
      </div>
    )}
  </>
)}

          </section>
        </div>
      </div>
    </div>
  );
}
