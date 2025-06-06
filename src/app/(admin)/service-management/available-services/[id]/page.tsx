// app/service/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useService } from "@/app/context/ServiceContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Image from "next/image";
import ComponentCard from "@/components/common/ComponentCard";
import { ChevronDownIcon } from "@/icons";

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const { fetchSingleService, singleService, loadingSingleService, errorSingleService } = useService();
  const [activeTab, setActiveTab] = useState<'service' | 'franchise'>('service');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchSingleService(id as string);
    }
  }, [id]);

  const highlightRaw = singleService?.serviceDetails?.highlight;

  // Normalize to string[] whether it's File[] or string[]
  const highlightArray: string[] = Array.isArray(highlightRaw)
    ? highlightRaw.map((item) =>
      typeof item === 'string' ? item : URL.createObjectURL(item)
    )
    : [];

  if (loadingSingleService) return <p>Loading...</p>;
  if (errorSingleService) return <p>{errorSingleService}</p>;
  if (!singleService) return <p>No service found.</p>;

  return (
    <div className="p-4 space-y-6">
      <PageBreadcrumb pageTitle={`${singleService.serviceName}`} />
      <div className="flex items-center gap-6">
        <Image
          src={singleService.thumbnailImage}
          alt={singleService.serviceName}
          width={150}
          height={100}
          className="rounded shadow"
        />
        <div>
          <h2 className="text-2xl font-semibold">{singleService.serviceName}</h2>
          <p className="text-gray-600">{singleService.category.name} / {singleService.subcategory.name}</p>
          <p className="text-lg font-medium mt-2">₹{singleService.price}</p>
        </div>

      </div>

      {/* <div className="flex items-center gap-6">
        <div>
          <p className="text-gray-600">Cover Images</p>
        </div>
        {singleService.bannerImages.map((bannerUrl, index) => (
          <Image
            key={index}
            src={bannerUrl}
            alt={`${singleService.serviceName} Banner ${index + 1}`}
            width={150}
            height={100}
            className="rounded shadow"
          />
        ))}
      </div> */}

      {/* Tabs */}
      <div className="border-b border-gray-300 mb-4">
        <button
          className={`px-4 py-2 mr-2 text-sm font-medium ${activeTab === 'service' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
            }`}
          onClick={() => setActiveTab('service')}
        >
          Service Details
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'franchise' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
            }`}
          onClick={() => setActiveTab('franchise')}
        >
          Franchise Details
        </button>
      </div>

      {/* Service Tab Content */}
      {activeTab === 'service' && (
        <ComponentCard title="Service Details">
          <div className="space-y-4">
            <SectionCard title="Overview" isHtml content={singleService.serviceDetails.overview} />
            <SectionCard title="Highlight">
              {highlightArray.map((img, index) => (
                <div key={index} style={{ marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden', position: 'relative', width: '100%', height: '300px' }}>
                  <Image
                    src={img}
                    alt={`Highlight ${index + 1}`}
                    layout="fill"        // fill parent div
                    objectFit="cover"    // cover styling, like CSS background-size: cover
                    style={{ borderRadius: '8px' }}
                    priority={index === 0}  // optionally prioritize the first image
                  />
                </div>
              ))}
            </SectionCard>

            <SectionCard title="Benefits" isHtml content={singleService.serviceDetails.benefits} />
            <SectionCard title="How It Works" isHtml content={singleService.serviceDetails.howItWorks} />
            <SectionCard title="Terms and Conditions" isHtml content={singleService.serviceDetails.termsAndConditions} />
            <SectionCard title="Document" isHtml content={singleService.serviceDetails.document} />
            {(singleService.serviceDetails.whyChoose as any[]).map((item: any, idx: number) => (
              <SectionCard key={item._id || idx} title="Highlight">
                <p>{item.title}</p>
                <p>{item.description}</p>
                {item.image && (

                  <div key={idx} style={{ marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden', position: 'relative', width: '100%', height: '250px' }}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      layout="fill"        // fill parent div
                      objectFit="cover"    // cover styling, like CSS background-size: cover
                      style={{ borderRadius: '8px' }}
                      priority={idx === 0}  // optionally prioritize the first image
                    />
                  </div>
                )}
              </SectionCard>
            ))}

            {singleService.serviceDetails.faqs && singleService.serviceDetails.faqs.length > 0 && (
              <ComponentCard title="FAQs">
                <div className="space-y-2">
                  {singleService.serviceDetails.faqs.map(
                    (item: { question: string; answer: string }, i: number) => (
                      <div key={i} className="border rounded-md p-3 shadow-sm bg-white">
                        <button
                          onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                          className="flex items-center justify-between w-full text-left"
                        >
                          <span className="flex items-center font-medium text-primary">
                            <ChevronDownIcon className="mr-2" />
                            Q: {item.question}
                          </span>
                          {openFaqIndex === i ? (
                            <ChevronDownIcon className="text-xl" />
                          ) : (
                            <ChevronDownIcon className="text-xl" />
                          )}
                        </button>
                        {openFaqIndex === i && (
                          <div className="mt-2 ml-6 text-gray-700 text-sm">
                            <strong>A:</strong> {item.answer}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>

              </ComponentCard>
            )}

            {/* Extra Sections */}
            {singleService.serviceDetails.rows && singleService.serviceDetails.rows.length > 0 && (
              <ComponentCard title="Extra Sections">
                {singleService.serviceDetails.rows.map(
                  (item: { title: string; description: string }, i: number) => (
                    <div key={i} className="mb-4">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-700">{item.description}</p>
                    </div>
                  )
                )}
              </ComponentCard>

            )}

          </div>
        </ComponentCard>
      )}

      {/* Franchise Tab Content */}
      {activeTab === 'franchise' && (
        <ComponentCard title="Franchise Details">
          <div className="space-y-4">
            <SectionCard title="Commission" content={singleService.franchiseDetails.commission.toString()} />
            <SectionCard title="Overview" isHtml content={singleService.franchiseDetails.overview} />
            <SectionCard title="How It Works" isHtml content={singleService.franchiseDetails.howItWorks} />
            <SectionCard title="Terms & Conditions" isHtml content={singleService.franchiseDetails.termsAndConditions} />

            {singleService.franchiseDetails.extraSections && singleService.franchiseDetails.extraSections.length > 0 && (
              <ComponentCard title="Extra Sections">
                {singleService.franchiseDetails.extraSections.map(
                  (item: { title: string; description: string }, i: number) => (
                    <div key={i} className="mb-4">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-700">{item.description}</p>
                    </div>
                  )
                )}
              </ComponentCard>

            )}
          </div>
        </ComponentCard>
      )}

    </div>
  );
};

// Section Card Component
const SectionCard = ({
  title,
  content,
  icon,
  isHtml = false,
  children,
}: {
  title: string;
  content?: string;
  icon?: React.ReactNode;
  isHtml?: boolean;
  children?: React.ReactNode;
}) => (

  <div className="bg-white shadow-sm border rounded p-4">
    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
      {icon}
      {title}
    </h4>

    {children ? (
      <div className="text-sm text-gray-700">{children}</div>
    ) : isHtml ? (
      <div
        className="text-sm text-gray-700"
        dangerouslySetInnerHTML={{ __html: content || '' }}
      />
    ) : (
      <p className="text-sm text-gray-700">{content}</p>
    )}
  </div>
);

export default ServiceDetailsPage;
