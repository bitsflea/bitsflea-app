import React, { useState, useMemo } from 'react';
import { ThumbsUp, ThumbsDown, Star, Shield, AlertCircle, Search } from 'lucide-react';

interface Reviewer {
  id: number;
  avatar: string;
  nickname: string;
  description: string;
  creditScore: number;
  upVotes: number;
  downVotes: number;
  isReviewer: boolean;
  hasVoted?: 'up' | 'down';
  address: string;
}

const mockReviewers: Reviewer[] = [
  {
    id: 1,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60",
    nickname: "Alex Thompson",
    description: "Senior blockchain developer specializing in smart contract security audits with 5 years of review experience.",
    creditScore: 4.8,
    upVotes: 128,
    downVotes: 12,
    isReviewer: true,
    address: "0x1234...5678"
  },
  {
    id: 2,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60",
    nickname: "Sarah Chen",
    description: "Blockchain security expert with extensive experience in code auditing and deep knowledge of DeFi ecosystems.",
    creditScore: 4.9,
    upVotes: 156,
    downVotes: 8,
    isReviewer: true,
    address: "0x9876...4321"
  },
  {
    id: 3,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60",
    nickname: "Michael Rodriguez",
    description: "Full-stack developer skilled in identifying potential security vulnerabilities and maintaining community safety.",
    creditScore: 4.7,
    upVotes: 98,
    downVotes: 15,
    isReviewer: false,
    address: "0xabcd...efgh"
  }
];

export const ReviewerList: React.FC = () => {
  const [reviewers, setReviewers] = useState<Reviewer[]>(mockReviewers);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'nickname' | 'address'>('nickname');

  const handleVote = (reviewerId: number, voteType: 'up' | 'down') => {
    setReviewers(prev => prev.map(reviewer => {
      if (reviewer.id === reviewerId) {
        if (reviewer.hasVoted) {
          const updatedReviewer = {
            ...reviewer,
            upVotes: reviewer.hasVoted === 'up' ? reviewer.upVotes - 1 : reviewer.upVotes,
            downVotes: reviewer.hasVoted === 'down' ? reviewer.downVotes - 1 : reviewer.downVotes,
            hasVoted: undefined
          };

          if (reviewer.hasVoted === voteType) {
            return updatedReviewer;
          }

          return {
            ...updatedReviewer,
            upVotes: voteType === 'up' ? updatedReviewer.upVotes + 1 : updatedReviewer.upVotes,
            downVotes: voteType === 'down' ? updatedReviewer.downVotes + 1 : updatedReviewer.downVotes,
            hasVoted: voteType
          };
        }

        return {
          ...reviewer,
          upVotes: voteType === 'up' ? reviewer.upVotes + 1 : reviewer.upVotes,
          downVotes: voteType === 'down' ? reviewer.downVotes + 1 : reviewer.downVotes,
          hasVoted: voteType
        };
      }
      return reviewer;
    }));
  };

  const filteredReviewers = useMemo(() => {
    if (!searchQuery) return reviewers;
    
    const query = searchQuery.toLowerCase();
    return reviewers.filter(reviewer => {
      if (searchType === 'nickname') {
        return reviewer.nickname.toLowerCase().includes(query);
      } else {
        return reviewer.address.toLowerCase().includes(query);
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
                className={`px-4 py-1.5 rounded-md transition-colors ${
                  searchType === 'nickname'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Nickname
              </button>
              <button
                onClick={() => setSearchType('address')}
                className={`px-4 py-1.5 rounded-md transition-colors ${
                  searchType === 'address'
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
                key={reviewer.id}
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
                    <img
                      src={reviewer.avatar}
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
                            <span>{reviewer.creditScore}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{reviewer.address}</p>
                        <p className="text-gray-600 mb-4">{reviewer.description}</p>
                      </div>
                    </div>

                    {/* Voting */}
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleVote(reviewer.id, 'up')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          reviewer.hasVoted === 'up'
                            ? 'bg-green-100 text-green-700'
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        <ThumbsUp className={`h-5 w-5 ${reviewer.hasVoted === 'up' ? 'fill-current' : ''}`} />
                        <span>{reviewer.upVotes}</span>
                      </button>
                      <button
                        onClick={() => handleVote(reviewer.id, 'down')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          reviewer.hasVoted === 'down'
                            ? 'bg-red-100 text-red-700'
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        <ThumbsDown className={`h-5 w-5 ${reviewer.hasVoted === 'down' ? 'fill-current' : ''}`} />
                        <span>{reviewer.downVotes}</span>
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