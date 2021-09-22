import defrost from '@alex-schuster/defrost';
import template from '../templates/index.template.html';

document.addEventListener('DOMContentLoaded', () => {
  const component = defrost.init(document.documentElement, template);
  window.setTimeout(() => {
    component.foo = 'my friends';
  }, 2000);
});

