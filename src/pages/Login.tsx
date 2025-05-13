import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Form, FormField, TextInput, Text, Image } from 'grommet';
import { supabase } from '../lib/supabaseClient';
import { Mail, Lock } from 'lucide-react';
import HPELogo from '../components/ui/HPELogo';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (value: { email: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithPassword({
        email: value.email,
        password: value.password,
      });

      if (error) throw error;
      
      navigate('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      fill
      direction="row"
      background="light-1"
    >
      {/* Left Panel - Image */}
      <Box
        basis="1/2"
        background={{
          image: "url(https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg)",
          position: "center",
          size: "cover",
          opacity: "strong"
        }}
        style={{ position: 'relative' }}
      >
        <Box
          fill
          background={{ 
            color: 'brand',
            opacity: 'strong' 
          }}
          style={{ position: 'absolute' }}
        />
        <Box
          fill
          justify="center"
          align="center"
          pad="large"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <Text
            size="xxlarge"
            weight="bold"
            color="white"
            textAlign="center"
            margin={{ bottom: 'medium' }}
          >
            HPE Audit Portal
          </Text>
          <Text
            size="large"
            color="white"
            textAlign="center"
            style={{ maxWidth: '400px' }}
          >
            Streamline your datacenter operations with comprehensive audit workflows
          </Text>
        </Box>
      </Box>

      {/* Right Panel - Login Form */}
      <Box
        basis="1/2"
        align="center"
        justify="center"
        pad="large"
      >
        <Box
          width="medium"
        >
          <Box align="center" margin={{ bottom: 'large' }}>
            <HPELogo height={48} />
            <Text 
              margin={{ top: 'medium' }} 
              size="xxlarge" 
              weight="bold"
              color="brand"
              style={{ fontFamily: 'MetricHPE' }}
            >
              Hewlett Packard Enterprise
            </Text>
          </Box>
          
          <Form onSubmit={({ value }) => handleSubmit(value)}>
            <FormField 
              name="email" 
              label={
                <Text color="dark-3" margin={{ bottom: 'xsmall' }}>
                  Email address
                </Text>
              }
            >
              <TextInput
                name="email"
                icon={<Mail size={20} color="#666666" />}
                placeholder="Enter your email"
                type="email"
                required
              />
            </FormField>
            
            <FormField 
              name="password"
              label={
                <Text color="dark-3" margin={{ bottom: 'xsmall' }}>
                  Password
                </Text>
              }
            >
              <TextInput
                name="password"
                icon={<Lock size={20} color="#666666" />}
                placeholder="Enter your password"
                type="password"
                required
              />
            </FormField>

            {error && (
              <Box 
                margin={{ vertical: 'small' }} 
                background="status-error" 
                pad="small" 
                round="small"
              >
                <Text size="small" color="white">
                  {error}
                </Text>
              </Box>
            )}

            <Button
              type="submit"
              primary
              label={loading ? 'Signing in...' : 'Sign In'}
              disabled={loading}
              margin={{ top: 'medium' }}
              color="brand"
              fill="horizontal"
            />
          </Form>

          <Box align="center" margin={{ top: 'medium' }}>
            <Text size="small" color="dark-3">
              Contact your administrator if you need access
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;