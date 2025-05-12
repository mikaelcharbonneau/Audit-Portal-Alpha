import { useState } from 'react';
import { Download, Filter, Printer, Share2, Eye, ArrowLeft, ArrowRight } from 'lucide-react';
import ReportFilters from '../components/reports/ReportFilters';
import { reports } from '../data/mockData';
import StatusChip from '../components/ui/StatusChip';
import { format } from 'date-fns';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

const Reports = () => {
  const [filters, setFilters] = useState({});
  const [filteredReports, setFilteredReports] = useState(reports);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 3,
      spacing: 32,
      origin: 'center',
    },
    loop: true,
    mode: 'free-snap',
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
    breakpoints: {
      '(max-width: 900px)': {
        slides: { perView: 2, spacing: 16 },
      },
      '(max-width: 600px)': {
        slides: { perView: 1, spacing: 8 },
      },
    },
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setFilteredReports(reports);
  };

  const toggleReportSelection = (reportId: string) => {
    setSelectedReport(selectedReport === reportId ? null : reportId);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-hpe-blue-700">Reports</h1>
        <div className="flex space-x-2">
          <button className="btn-secondary">
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
          <button className="btn-secondary">
            <Printer className="h-4 w-4 mr-1" />
            Print
          </button>
          <button className="btn-secondary">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <ReportFilters onFilterChange={handleFilterChange} />
      </div>

      {/* Carousel Navigation */}
      <div className="flex justify-center items-center mb-4 gap-4">
        <button
          className="p-2 rounded-full bg-gray-50 hover:bg-hpe-green-100 text-hpe-blue-700"
          onClick={() => instanceRef.current?.prev()}
          aria-label="Previous"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          className="p-2 rounded-full bg-gray-50 hover:bg-hpe-green-100 text-hpe-blue-700"
          onClick={() => instanceRef.current?.next()}
          aria-label="Next"
        >
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Reports Carousel */}
      <div ref={sliderRef} className="keen-slider py-8">
        {filteredReports.map((report, idx) => (
          <div
            key={report.id}
            className="keen-slider__slide flex flex-col items-stretch justify-between bg-white rounded-xl shadow-lg p-6 transition-transform duration-300"
            style={{ minHeight: 420, minWidth: 320, maxWidth: 400 }}
          >
            <div className="flex-1 flex flex-col">
              <h2 className="text-lg font-bold mb-2 text-hpe-blue-900">{report.title}</h2>
              <p className="text-sm text-hpe-blue-700 mb-3">{report.location} • {new Date(report.date).toLocaleDateString()}</p>
              <div className="mb-3">
                <span className="font-semibold text-hpe-green-400">Issues:</span>
                <ul className="mt-1 space-y-1">
                  {report.issues.length > 0 ? (
                    report.issues.slice(0, 3).map((issue) => (
                      <li key={issue.id} className="flex items-center text-sm text-hpe-blue-900">
                        <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: issue.severity === 'critical' ? '#FF0000' : issue.severity === 'high' ? '#FFA500' : issue.severity === 'medium' ? '#FFCC00' : '#00CC00' }}></span>
                        {issue.description}
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-gray-400 italic">No issues found</li>
                  )}
                </ul>
              </div>
              {report.recommendations && (
                <div className="mb-3">
                  <span className="font-semibold text-hpe-green-400">Recommendations:</span>
                  <p className="text-sm text-hpe-blue-900 mt-1">{report.recommendations}</p>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-4">
              <button className="btn-secondary py-1.5 px-2.5 text-xs flex-1 mr-2" onClick={() => toggleReportSelection(report.id)}>
                <Eye className="h-3.5 w-3.5 mr-1" />
                View
              </button>
              <button className="btn-secondary py-1.5 px-2.5 text-xs flex-1 mr-2">
                <Download className="h-3.5 w-3.5 mr-1" />
                Download
              </button>
              <button className="btn-secondary py-1.5 px-2.5 text-xs flex-1">
                <Share2 className="h-3.5 w-3.5 mr-1" />
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;