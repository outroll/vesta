Name:           devit-ioncube
Version:        1.0.0
Release:        1
Summary:        ionCube Loader
Group:          System Environment/Base
License:        "Freely redistributable without restriction"
URL:            https://www.ioncube.com
Vendor:         ioncube.com
Source0:        %{name}-%{version}.tar.gz
BuildRoot:      %{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)
Requires:       devit-php
Provides:       devit-ioncube

%define         _devitdir  /usr/local/devit/ioncube

%description
This package contains ionCube loader for devit

%global debug_package %{nil}

%prep
%setup -q -n %{name}-%{version}

%build

%install
install -d  %{buildroot}%{_devitdir}
%{__cp} -ad ./* %{buildroot}%{_devitdir}

%clean
rm -rf %{buildroot}

%post
if [ $1 -eq 1 ]; then
    if [ -e /usr/local/devit/ioncube/ioncube.sh ]; then
        /usr/local/devit/ioncube/ioncube.sh add
    fi
fi

%preun
if [ $1 -eq 0 ]; then
    if [ -e /usr/local/devit/ioncube/ioncube.sh ]; then
        /usr/local/devit/ioncube/ioncube.sh delete
    fi
fi

%files
%{_devitdir}

%changelog
* Fri Jun 16 2017 Serghey Rodin <builder@devitcp.com> - 0.9.8-18
- Initial package for ionCube 6.1.0

