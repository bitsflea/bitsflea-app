import { useEffect, useRef, useState } from 'react';
import { Navbar } from './components/Navbar';
import { ProductGrid } from './components/ProductGrid';
import { SearchBar } from './components/SearchBar';
import { CategoryMenu } from './components/CategoryMenu';
import { UserCenter, UserCenterRef } from './components/UserCenter';
import { LoginModal } from './components/LoginModal';
import { ReviewerList } from './components/ReviewerList';
import { ProductReview } from './components/ProductReview';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { useAuth } from './context/AuthContext';
import { isAddress } from 'nuls-api-v2';
import config from './data/config';
import { SaleBtn } from './components/SaleBtn';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<number | undefined | null>(null)
  const [showUserCenter, setShowUserCenter] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showReviewerList, setShowReviewerList] = useState(false)
  const [showProductReview, setShowProductReview] = useState(false)
  const [isPublish, setIsPublish] = useState(false)
  const [query, setQuery] = useState('')
  const { isAuthenticated, logout, user, loginEmitter } = useAuth()
  const userCenterRef = useRef<UserCenterRef>(null)

  const handlePublish = () => {
    setShowUserCenter(true)
    setTimeout(() => { userCenterRef.current?.showPublish() }, 300)
  }

  const handleLogin = () => {
    setIsPublish(true)
    setShowLoginModal(true)
  }

  useEffect(() => {
    const oldRef = localStorage.getItem(config.KEY_REF)
    console.debug("oldRef:", oldRef)
    if (!oldRef || !isAddress(oldRef)) {
      const params = new URLSearchParams(window.location.search)
      const ref = params.get(config.KEY_REF)
      console.debug("ref:", ref)
      if (ref && isAddress(ref)) {
        localStorage.setItem(config.KEY_REF, ref)
      }
    }

    const showLoginListener = () => {
      setShowLoginModal(true)
    }
    loginEmitter.on('showLogin', showLoginListener)

    // clean event
    return () => {
      loginEmitter.off('showLogin', showLoginListener)
    };
  }, [])

  const handleUserClick = () => {
    if (isAuthenticated) {
      setShowUserCenter(true);
      setShowReviewerList(false);
      setShowProductReview(false);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setShowUserCenter(true);
    if (isPublish) {
      setIsPublish(false)
      setTimeout(() => { userCenterRef.current?.showPublish() }, 200)
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserCenter(false);
  };

  const handleHomeClick = () => {
    setShowUserCenter(false);
    setShowReviewerList(false);
    setShowProductReview(false);
  };

  const handleReviewerClick = () => {
    setShowUserCenter(false);
    setShowReviewerList(true);
    setShowProductReview(false);
  };

  const handleProductReviewClick = () => {
    if (!isAuthenticated || !user?.isReviewer) return;
    setShowUserCenter(false);
    setShowReviewerList(false);
    setShowProductReview(true);
  };

  const handleSearch = (query: string) => {
    setQuery(query);
  }

  const renderContent = () => {
    if (showUserCenter) {
      return <UserCenter ref={userCenterRef} />;
    }
    if (showReviewerList) {
      return <ReviewerList />;
    }
    if (showProductReview) {
      return <ProductReview />;
    }
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Fixed Header Section */}
        <div className="fixed top-16 left-0 right-0 z-40 bg-gray-50">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-4 pb-4">
            {/* Desktop: Category Menu and Search Bar in separate rows */}
            <div className="hidden md:block">
              <CategoryMenu
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
            <div className="hidden md:block mt-4">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Mobile: Category Menu and Search Bar in same row */}
            <div className="flex md:hidden items-center gap-2">
              <CategoryMenu
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>

        {/* Content Section with top padding to account for fixed header */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 pb-20 md:pb-6">
          <div className="pt-[150px] md:pt-[240px]">
            <ProductGrid activeCategory={activeCategory} searchQuery={query} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        onUserClick={handleUserClick}
        onLogout={handleLogout}
        onHomeClick={handleHomeClick}
        onReviewerClick={handleReviewerClick}
        onProductReviewClick={handleProductReviewClick}
        showUserCenter={showUserCenter}
      />
      {renderContent()}
      <Footer />
      <BackToTop />
      <SaleBtn onPublish={handlePublish} onLogin={handleLogin} />
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}