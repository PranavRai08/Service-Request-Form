import React, { useState } from "react";
import { useForm } from "react-hook-form";

// Helper component for form navigation buttons
const FormNavigation = ({ currentStep, totalSteps, onBack, onNext, onSubmitForm }) => {
  return (
    <div className="flex justify-between mt-6">
      {currentStep > 1 && (
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300"
        >
          Previous
        </button>
      )}
      {currentStep < totalSteps && (
        <button
          type="button"
          onClick={onNext}
          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Continue
        </button>
      )}
      {currentStep === totalSteps && (
        <button
          type="submit"
          className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
        >
          Confirm & Send
        </button>
      )}
    </div>
  );
};

// Main multi-step service request form component
const ServiceRequestStepper = () => {
  const [currentFormStep, setCurrentFormStep] = useState(1);
  const [formCompleted, setFormCompleted] = useState(false);
  const [collectedData, setCollectedData] = useState({
    kidAge: "",
    kidDiagnosisInfo: "",
    educationalSetting: "",
    requestedServices: [],
    serviceFrequency: "",
    additionalComments: "",
    parentName: "",
    parentEmail: "",
    parentContact: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    trigger,
    getValues, // Added to merge data before step advance
  } = useForm({
    defaultValues: collectedData // Initialize form with existing data
  });

  const goToNextStep = async () => {
    // Dynamically get fields to validate for the current step
    let fieldsToValidate = [];
    if (currentFormStep === 1) {
      fieldsToValidate = ["kidAge", "kidDiagnosisInfo", "educationalSetting"];
    } else if (currentFormStep === 2) {
      fieldsToValidate = ["requestedServices", "serviceFrequency"];
    } else if (currentFormStep === 3) {
      fieldsToValidate = ["parentName", "parentEmail", "parentContact"];
    }

    const isCurrentStepValid = await trigger(fieldsToValidate);
    if (isCurrentStepValid) {
      // Update collectedData with current step's values before moving on
      setCollectedData(prev => ({ ...prev, ...getValues() }));
      setCurrentFormStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => setCurrentFormStep((prev) => prev - 1);

  const handleFormSubmission = (dataOnSubmit) => {
    const finalSubmissionData = { ...collectedData, ...dataOnSubmit };
    console.log("Final Form Data for Submission:", finalSubmissionData);
    setCollectedData(finalSubmissionData); // Ensure all data is captured
    setFormCompleted(true);
  };

  const renderCurrentStepContent = () => {
    switch (currentFormStep) {
      case 1:
        return (
          <>
            <h1 className="text-3xl font-extrabold mb-5 text-gray-800">New Service Request</h1>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Child's Details</h2>
            <div className="flex flex-col w-full max-w-md space-y-5">
              <input
                type="number"
                placeholder="Child's Age (e.g., 5)"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                {...register("kidAge", {
                  required: "Child's age is mandatory.",
                  min: { value: 0, message: "Age cannot be negative." }
                })}
              />
              {formErrors.kidAge && (
                <p className="text-red-500 text-sm">{formErrors.kidAge.message}</p>
              )}
              <input
                type="text"
                placeholder="Primary Diagnosis (e.g., Autism Spectrum Disorder)"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                {...register("kidDiagnosisInfo", {
                  required: "A diagnosis or reason for services is required.",
                })}
              />
              {formErrors.kidDiagnosisInfo && (
                <p className="text-red-500 text-sm">{formErrors.kidDiagnosisInfo.message}</p>
              )}
              <div>
                <label className="block font-medium mb-2 text-gray-700">Educational Setting</label>
                <div className="flex gap-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="Public School"
                      className="form-radio text-blue-600"
                      {...register("educationalSetting", {
                        required: "Please select a school type.",
                      })}
                    />
                    <span className="ml-2 text-gray-800">Public School</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      className="form-radio text-blue-600"
                      type="radio"
                      value="Private School"
                      {...register("educationalSetting")}
                    />
                    <span className="ml-2 text-gray-800">Private School</span>
                  </label>
                   <label className="flex items-center cursor-pointer">
                    <input
                      className="form-radio text-blue-600"
                      type="radio"
                      value="Homeschool"
                      {...register("educationalSetting")}
                    />
                    <span className="ml-2 text-gray-800">Homeschool</span>
                  </label>
                </div>
                {formErrors.educationalSetting && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.educationalSetting.message}</p>
                )}
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <div className="flex flex-col w-full max-w-md space-y-5">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Required Services</h2>
            <p className="text-gray-600">Select one or more services from the list below.</p>
            <select
              multiple
              className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              {...register("requestedServices", {
                required: "At least one service must be selected.",
                validate: (value) => value.length > 0 || "Please select at least one service."
              })}
            >
              <option value="" disabled>
                -- Select Services --
              </option>
              <option className="font-medium cursor-pointer" value="Speech Therapy">
                Speech Therapy
              </option>
              <option className="font-medium cursor-pointer" value="Occupational Therapy">
                Occupational Therapy
              </option>
              <option className="font-medium cursor-pointer" value="Special Education">
                Special Education
              </option>
              <option className="font-medium cursor-pointer" value="Physical Therapy">
                Physical Therapy
              </option>
            </select>
            {formErrors.requestedServices && (
              <p className="text-red-500 text-sm">{formErrors.requestedServices.message}</p>
            )}
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              {...register("serviceFrequency", {
                required: "Service frequency is required.",
              })}
            >
              <option value="">
                -- Select Desired Frequency --
              </option>
              <option className="font-medium cursor-pointer" value="Daily">
                Daily
              </option>
              <option className="font-medium cursor-pointer" value="Multiple Times Weekly">
                Multiple Times Weekly
              </option>
              <option className="font-medium cursor-pointer" value="Weekly">
                Weekly
              </option>
              <option className="font-medium cursor-pointer" value="Bi-Weekly">
                Bi-Weekly
              </option>
              <option className="font-medium cursor-pointer" value="Monthly">
                Monthly
              </option>
            </select>
            {formErrors.serviceFrequency && (
              <p className="text-red-500 text-sm">{formErrors.serviceFrequency.message}</p>
            )}
            <textarea
              placeholder="Any additional information or specific concerns you'd like us to know?"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              {...register("additionalComments")}
            />
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col w-full max-w-md space-y-5">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Parent/Guardian Information</h2>
            <input
              type="text"
              placeholder="Your Full Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              {...register("parentName", { required: "Your name is required." })}
            />
            {formErrors.parentName && (
              <p className="text-red-500 text-sm">{formErrors.parentName.message}</p>
            )}
            <input
              type="email"
              placeholder="Your Email Address"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              {...register("parentEmail", {
                required: "Email address is required.",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Invalid email address.",
                },
              })}
            />
            {formErrors.parentEmail && (
              <p className="text-red-500 text-sm">{formErrors.parentEmail.message}</p>
            )}
            <input
              type="tel" // Changed to tel for phone numbers
              placeholder="Your Contact Number (e.g., 123-456-7890)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              {...register("parentContact", {
                required: "A contact number is mandatory.",
                pattern: {
                  value: /^\+?[0-9\s\-()]{7,20}$/, // More flexible phone regex
                  message: "Invalid phone number format."
                }
              })}
            />
            {formErrors.parentContact && (
              <p className="text-red-500 text-sm">{formErrors.parentContact.message}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      {formCompleted ? (
        <div className="text-center bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6 text-green-700">
            Thank You! Your Request Has Been Submitted.
          </h2>
          <p className="text-gray-700 mb-4">We have received your information and will be in touch shortly.</p>
          <div className="bg-gray-100 p-6 rounded-md text-left text-sm text-gray-800 overflow-auto max-h-96">
            <h3 className="font-semibold mb-2">Summary of Your Submission:</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(collectedData, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleFormSubmission)} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-xl">
          {renderCurrentStepContent()}
          <FormNavigation
            currentStep={currentFormStep}
            totalSteps={3}
            onBack={goToPreviousStep}
            onNext={goToNextStep}
            onSubmitForm={handleFormSubmission} // Pass to the component, though submit is handled by form
          />
        </form>
      )}
    </div>
  );
};

export default ServiceRequestStepper;