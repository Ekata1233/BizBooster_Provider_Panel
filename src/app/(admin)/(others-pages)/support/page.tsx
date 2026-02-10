'use client';

import { useEffect, useState } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import { Mail, Phone, MessageCircle } from 'lucide-react';

type SupportData = {
  _id: string;
  email: string;
  call: string;
  whatsapp: string;
};

const Support = () => {
  const [support, setSupport] = useState<SupportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSupportData = async () => {
      try {
        const res = await fetch(
          'https://api.fetchtrue.com/api/providerhelpandsupport'
        );
        const result = await res.json();

        if (result.success && result.data.length > 0) {
          setSupport(result.data[0]);
        } else {
          setError('No support data found');
        }
      } catch (err) {
        setError('Failed to load support data');
      } finally {
        setLoading(false);
      }
    };

    fetchSupportData();
  }, []);

  return (
    <div>
      <PageBreadCrumb pageTitle="Support" />

      <ComponentCard title="Help & Support">
        {loading && (
          <p className="text-sm text-gray-500">Loading support details...</p>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {support && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Email */}
            <div className="flex items-center gap-4 p-4 border rounded-xl shadow-sm">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a
                  href={`mailto:${support.email}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {support.email}
                </a>
              </div>
            </div>

            {/* Call */}
            <div className="flex items-center gap-4 p-4 border rounded-xl shadow-sm">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Call Us</p>
                <a
                  href={`tel:${support.call}`}
                  className="font-medium text-green-600 hover:underline"
                >
                  {support.call}
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center gap-4 p-4 border rounded-xl shadow-sm">
              <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                <MessageCircle size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">WhatsApp</p>
                <a
                  href={`https://wa.me/91${support.whatsapp}`}
                  target="_blank"
                  className="font-medium text-emerald-600 hover:underline"
                >
                  {support.whatsapp}
                </a>
              </div>
            </div>
          </div>
        )}
      </ComponentCard>
    </div>
  );
};

export default Support;
