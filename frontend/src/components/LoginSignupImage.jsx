const LoginSignupImage = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center space-y-8">
        {/* Chat animation section */}
        <div className="flex flex-col items-start space-y-3">
          <div className="self-start bg-primary text-white px-4 py-2 rounded-xl animate-bounce">
            Hey there 👋
          </div>
          <div className="self-end bg-base-100 px-4 py-2 rounded-xl animate-fadeIn">
            Welcome to our community! 🎉
          </div>
          <div className="self-start bg-primary text-white px-4 py-2 rounded-xl animate-pulse">
            Let’s get you started!
          </div>
        </div>

        {/* Title and subtitle */}
        <div>
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-base-content/60">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupImage;
