---
meta:
    title: Login
    description:
layout: component
---

```html:preview
<terra-login>
  <span slot="loading">Please wait...checking if you are logged in...</span>
  <span slot="logged-in">You are logged in!</span>
</terra-login>
```

```jupyter
%pip install -q "terra_ui_components" "anywidget"
from terra_ui_components import TerraLogin
login = TerraLogin()
login
```

[component-metadata:terra-login]
