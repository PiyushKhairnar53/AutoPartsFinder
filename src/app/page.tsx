'use client';

import { useState } from 'react';
import UploadCSV from '@/components/UploadCSV';
import SearchSKU from '@/components/SearchSKU';

interface Step {
  number: number;
  label: string;
}

const steps: Step[] = [
  { number: 1, label: 'Upload Documents' },
  { number: 2, label: 'Search Product' },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);

  const changeStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div>
      <div className="appWrapper">
        <div className="navbarWrapper overflow-hidden">
          <nav className="navbar navbar-expand-lg bg-white px-5">
            <div className="align-items-center d-flex py-2  ">
              <span className="aiAssistText">Auto Parts Finder</span>
            </div>
          </nav>
        </div>

        <div className="contentWrapper overflow-auto pt-4">
          <div className="container stepper-container">
            <div className="d-flex justify-content-start align-items-center pb-3">
              {steps.map((step) => (
                <div key={step.number} className="d-flex align-items-center">
                  <div
                    className={`stepBox me-2 ${
                      currentStep === step.number ? 'activeStep' : 'inactiveStep'
                    }`}
                  >
                    {step.number}
                  </div>

                  <div
                    className={currentStep === step.number ? 'fw-bold text-dark' : 'text-muted'}
                  >
                    {step.label}
                  </div>

                  {step.number < steps.length && <div className="dottedLine mx-3" />}
                </div>
              ))}
            </div>
          </div>

          {currentStep === 1 ? (
            <UploadCSV onChangeStep={changeStep} />
          ) : (
            <SearchSKU onChangeStep={changeStep} />
          )}
        </div>
      </div>
    </div>
  );
}