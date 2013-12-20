'''
Created on Jul 31, 2012

@author: daoxuandung
'''
'''
Created on Jul 31, 2012

@author: daoxuandung
'''
import re
from jinja2 import evalcontextfilter, Markup, escape
import urlparse
import logging
import jinja2
import os


_paragraph_re = re.compile(r'(?:\r\n|\r|\n){2,}')

@evalcontextfilter
def nl2br(eval_ctx, value):
    result = u'\n\n'.join(u'<p>%s</p>' % p.replace('\n', '<br>\n') \
        for p in _paragraph_re.split(escape(value)))
    if eval_ctx.autoescape:
        result = Markup(result)
    return result

def domain(value):
    logging.info(value)
    els = urlparse.urlparse(value)
    domain = els.netloc
    return domain

def username(user):
    if 'username' in user:
        return user.get('username')
    
    if 'auth_ids' in user:        
        email = user['auth_ids'][0]
        return email.split('@')[0]
        
def jinja_environment(base="templates", child=""):
    """
    Create jinja_environment for a template at specified file structure
    
    Simplest use: put a file inside 'templates' folder, and try
        template = jinja_lib.jinja_environment().get_template('upload-image.html')
    
    If template file inside a child folder, just replace child variable
        template = 
            jinja_lib.jinja_environment(child="child_dir").get_template('upload-image.html')
    """
    base_paths = os.path.split(os.path.dirname(__file__))
    template_dir = os.path.join(base_paths[0], base, child)
    env = jinja2.Environment(autoescape=False, loader=jinja2.FileSystemLoader(template_dir),
                             extensions=['jinja2.ext.loopcontrols', 'jinja2.ext.autoescape'])
    env.filters['nl2br'] = nl2br
    env.filters['domain'] = domain
    env.filters['username'] = username
    return env