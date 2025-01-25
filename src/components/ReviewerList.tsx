import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ThumbsUp, ThumbsDown, Star, Shield, AlertCircle, Search } from 'lucide-react';
import { useHelia } from '../context/HeliaContext';
import { Reviewer } from '../types';
import { ImageIPFS } from './ImageIPFS';
import { useAuth } from '../context/AuthContext';
import { ExtendInfo } from './ExtendInfo';
import { useLoading } from '../context/LoadingContext';
import config from '../data/config';
import { useToast } from '../context/ToastContext';

const ITEMS_PER_PAGE = 8;

export const ReviewerList: React.FC = () => {
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'nickname' | 'address'>('nickname');
  const { user } = useAuth();
  const { rpc, nuls } = useHelia();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchReviewer = async () => {
      const name = searchType === 'nickname' ? searchQuery : null
      const address = searchType === 'address' ? searchQuery : null
      const data = await rpc!.request("getReviewer", [name, address, page, ITEMS_PER_PAGE])
      console.log("data:", data)
      setReviewers(data.result)
    }
    if (rpc) {
      fetchReviewer()
    }
  }, [searchQuery, rpc, user])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, loading, page, searchQuery]);

  const loadMore = async () => {
    setLoading(true);

    const nextPage = page + 1;
    const name = searchType === 'nickname' ? searchQuery : null
    const address = searchType === 'address' ? searchQuery : null
    const data = await rpc!.request("getReviewer", [name, address, page, ITEMS_PER_PAGE])

    if (data.result.length >= ITEMS_PER_PAGE) {
      setReviewers(prev => [...prev, ...data.result]);
      setPage(nextPage);
      setHasMore(data.result.length >= ITEMS_PER_PAGE);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  };

  const hasVoted = (voted: string) => {
    const obj = JSON.parse(voted)
    return Object.keys(obj).includes(user!.uid)
  }

  const handleVote = async (reviewerId: string, voteType: 'up' | 'down') => {
    console.log(reviewerId, voteType)
    showLoading();
    try {
      const callData = {
        from: user!.uid,
        value: 0,
        contractAddress: config.contracts.Bitsflea,
        methodName: "voteReviewer",
        methodDesc: "",
        args: [reviewerId, voteType === 'up'],
        multyAssetValues: []
      }
      console.log("callData:", callData);
      const txHash = await window.nabox!.contractCall(callData);
      await nuls?.waitingResult(txHash);
    } catch (e: unknown) {
      if (e instanceof Error) {
        showToast("error", e.message)
      } else {
        console.error("Unknown error:", e);
      }
    }
    hideLoading();
  };

  const filteredReviewers = useMemo(() => {
    if (!searchQuery) return reviewers;

    const query = searchQuery.toLowerCase();
    return reviewers.filter(reviewer => {
      if (searchType === 'nickname') {
        return reviewer.nickname.toLowerCase().includes(query);
      } else {
        return reviewer.uid.toLowerCase().includes(query);
      }
    });
  }, [reviewers, searchQuery, searchType]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Reviewer Election</h1>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">About Reviewer Election</p>
              <p>Reviewers are responsible for verifying product information on the platform to ensure authenticity and reliability. You can vote to support trusted users to become reviewers. Reviewers must maintain good credit scores and receive broad community recognition.</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search by ${searchType}...`}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              />
            </div>
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setSearchType('nickname')}
                className={`px-4 py-1.5 rounded-md transition-colors ${searchType === 'nickname'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Nickname
              </button>
              <button
                onClick={() => setSearchType('address')}
                className={`px-4 py-1.5 rounded-md transition-colors ${searchType === 'address'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Address
              </button>
            </div>
          </div>
        </div>

        {/* Reviewer List */}
        <div className="space-y-6">
          {filteredReviewers.length > 0 ? (
            filteredReviewers.map(reviewer => (
              <div
                key={reviewer.uid}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300 relative"
              >
                {reviewer.isReviewer && (
                  <div className="absolute top-4 right-4 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Shield className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">Reviewer</span>
                  </div>
                )}
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <ImageIPFS
                      image={reviewer.head}
                      alt={reviewer.nickname}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {reviewer.nickname}
                          </h3>
                          <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-sm">
                            <Star className="h-4 w-4 fill-current" />
                            <span>{reviewer.creditValue}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{reviewer.uid}</p>
                        <ExtendInfo className="text-gray-600 mb-4" extendInfo={reviewer.extendInfo} />
                      </div>
                    </div>

                    {/* Voting */}
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleVote(reviewer.uid, 'up')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-600`}
                      >
                        <ThumbsUp className={`h-5 w-5 ${hasVoted(reviewer.voted) ? 'fill-current' : ''}`} />
                        <span>{reviewer.approveCount}</span>
                      </button>
                      <button
                        onClick={() => handleVote(reviewer.uid, 'down')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-600`}
                      >
                        <ThumbsDown className={`h-5 w-5 ${hasVoted(reviewer.voted) ? 'fill-current' : ''}`} />
                        <span>{reviewer.againstCount}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No reviewers found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};