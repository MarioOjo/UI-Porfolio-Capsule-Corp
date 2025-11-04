import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FaRocket, FaUsers, FaGlobe, FaAward, FaLightbulb, FaShieldAlt } from 'react-icons/fa';

function About() {
  const { isDarkMode } = useTheme();

  const stats = [
    { icon: FaRocket, number: '50+', label: 'Years of Innovation', color: 'blue' },
    { icon: FaUsers, number: '10K+', label: 'Satisfied Warriors', color: 'orange' },
    { icon: FaGlobe, number: '7', label: 'Planets Served', color: 'green' },
    { icon: FaAward, number: '∞', label: 'Z-Fighter Approved', color: 'yellow' }
  ];

  const milestones = [
    {
      year: 'Age 712',
      title: 'Foundation',
      description: 'Dr. Brief establishes Capsule Corporation, revolutionizing storage technology.',
      icon: FaLightbulb
    },
    {
      year: 'Age 739',
      title: 'Global Expansion',
      description: 'Capsule Corp becomes the world\'s leading technology company.',
      icon: FaGlobe
    },
    {
      year: 'Age 761',
      title: 'Z-Fighter Partnership',
      description: 'Official partnership with Earth\'s greatest warriors begins.',
      icon: FaShieldAlt
    },
    {
      year: 'Age 762',
      title: 'Present Day',
      description: 'Continuing to push the boundaries of what\'s possible in technology.',
      icon: FaRocket
    }
  ];

  return (
    <div className={`min-h-screen py-8 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-orange-50'}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden mb-12 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'}`}>
          <div className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-saiyan">
                ABOUT CAPSULE CORP
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Pioneering the future of technology since Age 712
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className={`rounded-2xl shadow-lg p-8 mb-12 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'}`}>
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-bold font-saiyan mb-4 ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
              OUR MISSION
            </h2>
            <p className={`text-lg max-w-4xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              To create revolutionary technology that empowers heroes, protects the innocent, and pushes the boundaries of what's possible. 
              From capsule storage systems to gravity training chambers, we're dedicated to making the impossible, possible.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`rounded-xl shadow-lg p-6 text-center transition-transform duration-300 hover:scale-105 ${
                isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'
              }`}
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-r ${
                stat.color === 'blue' ? 'from-blue-500 to-blue-600' :
                stat.color === 'orange' ? 'from-orange-500 to-red-500' :
                stat.color === 'green' ? 'from-green-500 to-blue-500' :
                'from-yellow-500 to-orange-500'
              }`}>
                <stat.icon className="text-white text-2xl" />
              </div>
              <h3 className={`text-2xl font-bold font-saiyan mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {stat.number}
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Company History */}
        <div className={`rounded-2xl shadow-lg p-8 mb-12 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'}`}>
          <h2 className={`text-3xl font-bold font-saiyan mb-8 text-center ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
            OUR JOURNEY
          </h2>
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r ${
                    index % 2 === 0 ? 'from-[#3B4CCA] to-blue-600' : 'from-orange-500 to-red-500'
                  }`}>
                    <milestone.icon className="text-white text-xl" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold font-saiyan ${
                      isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {milestone.year}
                    </span>
                  </div>
                  <h3 className={`text-xl font-bold font-saiyan mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {milestone.title}
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className={`rounded-2xl shadow-lg p-8 mb-12 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'}`}>
          <h2 className={`text-3xl font-bold font-saiyan mb-8 text-center ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
            OUR VALUES
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <FaLightbulb className="text-white text-3xl" />
              </div>
              <h3 className={`text-xl font-bold font-saiyan mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                INNOVATION
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                We constantly push the boundaries of technology to create solutions that seemed impossible yesterday.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <FaShieldAlt className="text-white text-3xl" />
              </div>
              <h3 className={`text-xl font-bold font-saiyan mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                PROTECTION
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Every product we create is designed to protect and empower those who defend our world.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                <FaUsers className="text-white text-3xl" />
              </div>
              <h3 className={`text-xl font-bold font-saiyan mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                COMMUNITY
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                We believe in supporting heroes and building a stronger community of warriors and protectors.
              </p>
            </div>
          </div>
        </div>

        {/* Leadership Section */}
        <div className={`rounded-2xl shadow-lg p-8 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'}`}>
          <h2 className={`text-3xl font-bold font-saiyan mb-8 text-center ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
            LEADERSHIP TEAM
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`p-6 rounded-xl transition-colors duration-300 ${
              isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'
            }`}>
              <h3 className={`text-xl font-bold font-saiyan mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                DR. BRIEF
              </h3>
              <p className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Founder & Chief Scientist
              </p>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                The brilliant mind behind Capsule Corporation's revolutionary technology. Dr. Brief's innovations have transformed how we think about storage, transportation, and scientific advancement.
              </p>
            </div>
            
            <div className={`p-6 rounded-xl transition-colors duration-300 ${
              isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'
            }`}>
              <h3 className={`text-xl font-bold font-saiyan mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                BULMA BRIEF
              </h3>
              <p className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                President & Head of R&D
              </p>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Leading the next generation of Capsule Corp innovations, Bulma combines her father's genius with practical experience from working alongside Earth's greatest heroes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;