Name:           devit-softaculous
Version:        1.0.0
Release:        1
Summary:        devit Control Panel
Group:          System Environment/Base
License:        Softaculous License
URL:            https://www.softaculous.com
Vendor:         devitcp.com
Source0:        %{name}-%{version}.tar.gz
BuildRoot:      %{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)
Requires:       devit-ioncube
Provides:       devit-softaculous

%define         _devitdir  /usr/local/devit/softaculous

%description
This package contains Softaculous apps for devit Control Panel web interface.

%global debug_package %{nil}

%prep
%setup -q -n %{name}-%{version}

%build

%install
install -d  %{buildroot}%{_devitdir}
%{__cp} -ad ./* %{buildroot}%{_devitdir}

%clean
rm -rf %{buildroot}


%files
%defattr(-,root,root)
%attr(755,root,root) %{_devitdir}
%config(noreplace) %{_devitdir}/conf

%changelog
* Tue Nov 27 2018 Serghey Rodin <builder@devitcp.com> - 0.9.8-24
- New version 5.1.2

* Mon Jul 21 2017 Serghey Rodin <builder@devitcp.com> - 0.9.8-18
- Initial build for Softaculous 4.9.2
