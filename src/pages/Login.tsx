import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, Form, FormField, TextInput, Text, Heading } from 'grommet';
import { supabase } from '../lib/supabaseClient';
import { Mail, Lock } from 'lucide-react';

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
      align="center"
      justify="center"
      pad="medium"
      background="light-2"
    >
      <Box
        width="medium"
        pad="large"
        background="white"
        round="small"
        elevation="small"
      >
        <Heading level={2} margin={{ top: 'none', bottom: 'medium' }} textAlign="center">
          Welcome Back
        </Heading>
        
        <Form onSubmit={({ value }) => handleSubmit(value)}>
          <FormField name="email" label="Email">
            <TextInput
              name="email"
              icon={<Mail size={20} />}
              placeholder="Enter your email"
              type="email"
              required
            />
          </FormField>
          
          <FormField name="password" label="Password">
            <TextInput
              name="password"
              icon={<Lock size={20} />}
              placeholder="Enter your password"
              type="password"
              required
            />
          </FormField>

          {error && (
            <Box margin={{ vertical: 'small' }} background="status-error" pad="small" round="small">
              <Text size="small" color="white">{error}</Text>
            </Box>
          )}

          <Button
            type="submit"
            primary
            label={loading ? 'Signing in...' : 'Sign In'}
            disabled={loading}
            margin={{ top: 'medium', bottom: 'small' }}
          />
        </Form>

        <Box align="center" margin={{ top: 'medium' }}>
          <Text size="small">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-500 hover:underline">
              Sign up
            </Link>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;