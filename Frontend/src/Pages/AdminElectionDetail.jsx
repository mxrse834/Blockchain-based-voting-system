import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import { ArrowLeft, UserPlus, Image as ImageIcon, Trash2, Users, AlertCircle, UploadCloud } from 'lucide-react';

export default function AdminElectionDetail() {
  const navigate = useNavigate();
  const { electionId } = useParams();
  
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingCandidate, setIsAddingCandidate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [electionId]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fetchData = async () => {
    try {
      const [electionRes, candidatesRes] = await Promise.all([
        api.get(`/elections/${electionId}`),
        api.get(`/elections/${electionId}/candidates`)
      ]);
      setElection(electionRes.data.data);
      setCandidates(candidatesRes.data.data || []);
    } catch (err) {
      setError('Failed to load election data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Upload Logic
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file format. Please upload JPEG, PNG, or WebP.');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError('File size must be under 5MB.');
      return false;
    }
    return true;
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!newCandidateName.trim()) {
      setError('Candidate name cannot be empty');
      return;
    }

    setIsAddingCandidate(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', newCandidateName);
      if (selectedFile) {
        formData.append('photo', selectedFile);
      }

      const response = await api.post(`/elections/${electionId}/candidates`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setCandidates([...candidates, response.data.data]);
      setNewCandidateName('');
      handleRemoveFile();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add candidate');
    } finally {
      setIsAddingCandidate(false);
    }
  };

  const handleDeleteCandidate = async () => {
    if (!deleteTarget) return;

    try {
      await api.delete(`/elections/${electionId}/candidates/${deleteTarget}`);
      setCandidates(candidates.filter(c => c.candidate_id !== deleteTarget));
    } catch (err) {
      setError('Failed to delete candidate');
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <Layout><LoadingSpinner message="Loading election details..." /></Layout>;
  if (!election) return <Layout><div className="text-center py-20 text-slate-500 font-medium">Election not found</div></Layout>;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto animate-fade-in pb-12 w-full">
        <button
          onClick={() => navigate('/admin-elections')}
          className="group flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Elections
        </button>

        {/* Header Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center shadow-sm">
                  <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-indigo-950 dark:text-slate-100 mb-1">
                    {election.title}
                  </h1>
                  <StatusBadge status={election.status} />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-4 leading-relaxed max-w-2xl">
                Manage the candidate roster for this election. Add candidates with their information and upload profile photos. Note that candidates cannot be altered once the election is ACTIVE or CLOSED.
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 px-5 py-4 rounded-lg border border-slate-200 dark:border-slate-700/50 shadow-sm shrink-0">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-md text-indigo-600 dark:text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">Total Candidates</span>
                <span className="block text-2xl font-extrabold tracking-tight text-indigo-950 dark:text-slate-100 leading-none">{candidates.length}</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8">
            <Toast type="error" message={error} dismissible={true} onDismiss={() => setError('')} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Add Candidate Form */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sticky top-24 shadow-sm">
              <h2 className="text-lg font-extrabold tracking-tight text-indigo-950 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <UserPlus className="w-5 h-5 text-indigo-500" />
                Add Candidate
              </h2>
              
              <form onSubmit={handleAddCandidate} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={newCandidateName}
                    onChange={(e) => setNewCandidateName(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm text-indigo-950 dark:text-slate-100 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:opacity-50"
                    disabled={isAddingCandidate || election.status !== 'UPCOMING'}
                  />
                  {election.status !== 'UPCOMING' && (
                     <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-md flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                        Candidates can only be modified in UPCOMING state.
                      </p>
                     </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 mt-4 inline-block">
                    Profile Photo
                  </label>
                  <div 
                    className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out text-center overflow-hidden
                      ${isDragging 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                        : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                      ${previewUrl ? 'p-2' : 'p-8'}
                      ${election.status !== 'UPCOMING' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    onDragOver={election.status === 'UPCOMING' ? handleDragOver : undefined}
                    onDragLeave={election.status === 'UPCOMING' ? handleDragLeave : undefined}
                    onDrop={election.status === 'UPCOMING' ? handleDrop : undefined}
                    onClick={() => election.status === 'UPCOMING' && !previewUrl ? fileInputRef.current?.click() : undefined}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileSelect}
                      disabled={election.status !== 'UPCOMING' || isAddingCandidate}
                    />
                    
                    {previewUrl ? (
                      <div className="relative w-full aspect-square max-h-48 mx-auto rounded-lg overflow-hidden group">
                        <img 
                          src={previewUrl} 
                          alt="Candidate preview" 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 backdrop-blur-[2px]">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile();
                            }}
                            className="p-3 bg-red-600 text-white rounded-full hover:bg-red-500 transition-colors shadow-lg transform hover:scale-110"
                            title="Remove image"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                           <UploadCloud className={`w-6 h-6 transition-colors ${isDragging ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                        </div>
                        <span className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {isDragging ? 'Drop file here' : 'Click or drop file'}
                        </span>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-500">
                          JPG, PNG, WebP up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                   <button
                     type="submit"
                     disabled={isAddingCandidate || !newCandidateName.trim() || election.status !== 'UPCOMING'}
                     className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                   >
                     {isAddingCandidate ? 'Saving...' : 'Save Candidate'}
                   </button>
                </div>
              </form>
            </div>
          </div>

          {/* Current Candidates List */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm h-full">
              <h2 className="text-lg font-extrabold tracking-tight text-indigo-950 dark:text-slate-100 mb-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <span>Current Candidates</span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">{candidates.length} Registered</span>
              </h2>

              {candidates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-4">
                     <Users className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                  </div>
                  <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 mb-2">No candidates found</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 text-center max-w-sm">
                    This election currently has no candidates. Use the form on the left to begin building the ballot.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {candidates.map(candidate => (
                    <div 
                      key={candidate.candidate_id} 
                      className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between hover:border-indigo-300 dark:hover:border-indigo-700/50 hover:bg-indigo-50/10 transition-all group shadow-sm"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        {/* Avatar */}
                        {candidate.avatar_url && !imageErrors[candidate.candidate_id] ? (
                          <img 
                            src={candidate.avatar_url} 
                            alt={candidate.name} 
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                            onError={() => setImageErrors(prev => ({ ...prev, [candidate.candidate_id]: true }))}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold uppercase text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0">
                            {candidate.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-indigo-950 dark:text-slate-100 truncate">
                            {candidate.name}
                          </h4>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                            ID: {candidate.candidate_id.substring(0,8)}...
                          </p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setDeleteTarget(candidate.candidate_id)}
                        disabled={election.status !== 'UPCOMING'}
                        className="p-2.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-0 focus:outline-none"
                        aria-label="Remove Candidate"
                        title="Remove Candidate"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {deleteTarget && (
        <ConfirmModal
          title="Remove Candidate?"
          message="Are you sure you want to remove this candidate from the election? This action cannot be undone."
          confirmLabel="Remove"
          cancelLabel="Cancel"
          onConfirm={handleDeleteCandidate}
          onCancel={() => setDeleteTarget(null)}
          danger
          icon={Trash2}
        />
      )}
    </Layout>
  );
}
