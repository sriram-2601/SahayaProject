import React from 'react';
import { Container, Grid, Typography, Box, Link as MuiLink, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, GitHub } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1B3B36', // Deep tranquil evergreen
        color: '#E2E8F0',
        paddingTop: 6,
        paddingBottom: 3,
        marginTop: 'auto',
        borderTop: '1px solid rgba(82, 183, 136, 0.2)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand & Purpose */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  backgroundColor: '#40916C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                }}
              >
                🌱
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Sahaya
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#CBD5E1', lineHeight: 1.7, mb: 2 }}>
              Dedicated to compassionate mental well-being support. Recognizing early signs of anxiety and distress through thoughtful, empathetic AI conversation and expert care connections.
            </Typography>
            <Box sx={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
              <Typography variant="caption" sx={{ color: '#D8F3DC', display: 'block', fontWeight: 600 }}>
                💡 Need immediate help?
              </Typography>
              <Typography variant="caption" sx={{ color: '#E2E8F0' }}>
                Reach out to mental health helplines: <strong>1800-599-0019</strong> (KIRAN India) or your local emergency service.
              </Typography>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#FFFFFF', mb: 2 }}>
              Wellness Tools
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              <MuiLink component={Link} to="/chatbot" sx={{ color: '#CBD5E1', textDecoration: 'none', '&:hover': { color: '#74C69D' } }}>
                AI Companion
              </MuiLink>
              <MuiLink component={Link} to="/consultancy" sx={{ color: '#CBD5E1', textDecoration: 'none', '&:hover': { color: '#74C69D' } }}>
                Specialists
              </MuiLink>
              <MuiLink component={Link} to="/notes" sx={{ color: '#CBD5E1', textDecoration: 'none', '&:hover': { color: '#74C69D' } }}>
                Private Journal
              </MuiLink>
              <MuiLink component={Link} to="/scribble-pad" sx={{ color: '#CBD5E1', textDecoration: 'none', '&:hover': { color: '#74C69D' } }}>
                Art Expression
              </MuiLink>
              <MuiLink component={Link} to="/tasksDone" sx={{ color: '#CBD5E1', textDecoration: 'none', '&:hover': { color: '#74C69D' } }}>
                Daily Goals
              </MuiLink>
            </Box>
          </Grid>

          {/* About & Support */}
          <Grid item xs={6} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#FFFFFF', mb: 2 }}>
              Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              <MuiLink component={Link} to="/about" sx={{ color: '#CBD5E1', textDecoration: 'none', '&:hover': { color: '#74C69D' } }}>
                About Our Mission
              </MuiLink>
              <MuiLink component={Link} to="/feedback" sx={{ color: '#CBD5E1', textDecoration: 'none', '&:hover': { color: '#74C69D' } }}>
                Share Thoughts & Feedback
              </MuiLink>
              <MuiLink component={Link} to="/UserInfoForm" sx={{ color: '#CBD5E1', textDecoration: 'none', '&:hover': { color: '#74C69D' } }}>
                Profile Settings
              </MuiLink>
              <Typography variant="body2" sx={{ color: '#94A3B8', mt: 1 }}>
                📍 Hyderabad, INDIA
              </Typography>
            </Box>
          </Grid>

          {/* Community & Social */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#FFFFFF', mb: 2 }}>
              Connect & Support
            </Typography>
            <Typography variant="body2" sx={{ color: '#CBD5E1', mb: 2 }}>
              Join a supportive community advocating for accessible mental health awareness.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                href="#!"
                aria-label="Facebook"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  '&:hover': { backgroundColor: '#40916C' },
                }}
              >
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton
                href="#!"
                aria-label="Twitter"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  '&:hover': { backgroundColor: '#40916C' },
                }}
              >
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton
                href="#!"
                aria-label="Instagram"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  '&:hover': { backgroundColor: '#40916C' },
                }}
              >
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton
                href="#!"
                aria-label="LinkedIn"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  '&:hover': { backgroundColor: '#40916C' },
                }}
              >
                <LinkedIn fontSize="small" />
              </IconButton>
              <IconButton
                href="#!"
                aria-label="GitHub"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  '&:hover': { backgroundColor: '#40916C' },
                }}
              >
                <GitHub fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright divider */}
        <Box
          sx={{
            textAlign: 'center',
            pt: 4,
            mt: 4,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            © {new Date().getFullYear()} Sahaya Care. Dedicated to Peace of Mind.
          </Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
            All conversations are private, safe & confidential.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
