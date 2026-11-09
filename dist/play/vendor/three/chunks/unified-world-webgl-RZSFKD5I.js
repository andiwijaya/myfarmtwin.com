// MyFarmTwin graphics transport v2: refreshed asset metadata; shared Three graph.
import{$ as jn,$a as vi,$b as Xi,A as Or,Aa as ca,Ab as ma,Ac as wn,B as Br,Ba as fa,Bb as _a,C as Gr,Ca as Ft,Cb as Gi,D as Hr,Da as rn,Db as ga,Dc as Ji,E as Vr,Ea as Wt,Eb as va,F as Wr,Fa as da,Fb as Hi,Fc as Un,G as kr,Ga as ii,Gb as Vi,Gc as _t,H as zr,Ha as Zt,Hb as Wi,Hc as ji,I as Xr,Ia as ri,Ib as ki,Ic as Fa,J as Kr,Ja as ai,Jb as Sa,Jc as Jt,K as qr,Ka as An,Kb as Ea,Kc as Oa,L as Yr,La as Rn,Lb as zi,M as Kn,Ma as Cn,Mb as He,Mc as Ba,N as Zr,Na as bn,Nb as Ye,Nc as Ga,O as $r,Oa as oi,Ob as Ma,P as Qr,Pa as si,Pb as xa,Pc as Nn,Q as Jr,Qa as li,Qb as Ta,Qc as Ha,R as jr,Ra as ci,Rb as Aa,S as ea,Sa as fi,Sb as Ra,T as ta,Ta as di,Tb as Ca,Tc as In,U as Dt,Ua as ui,Ub as ht,Uc as Va,V as qn,Va as pi,Vb as We,W as Yn,Wa as hi,Wb as Oe,Wc as er,X as Zn,Xa as Pn,Xb as Je,Y as $n,Ya as mi,Yb as ba,Z as Qn,Za as _i,Zb as mt,_ as Jn,_a as gi,_b as bt,a as Tr,aa as dn,ab as Si,ac as Pa,b as Wn,ba as nn,bb as Ei,bc as Qt,c as Ar,ca as En,cb as Mi,d as cn,da as Mn,db as xi,dc as La,e as Rr,ea as na,eb as Ti,f as jt,fa as xn,fb as Ai,fc as Dn,g as en,ga as ia,gb as Ri,gc as Ze,h as St,ha as Gt,hb as Ci,i as Lt,ia as ra,ib as bi,ic as Da,j as qt,ja as un,jb as Pi,jc as wa,k as fn,ka as At,kb as Li,kc as Ua,l as kn,la as Tn,lb as Di,lc as Ki,m as zn,ma as Ht,mb as wi,mc as qi,n as Xn,na as Ct,nb as Ui,nc as Na,o as Cr,oa as aa,ob as Ni,p as tn,pa as oa,pb as Ii,q as br,qa as pn,qb as Ln,r as Pr,ra as ei,rb as yi,rc as kt,s as Lr,sa as Vt,sb as Fi,sc as Ia,t as Dr,ta as yt,tb as ua,u as wr,ua as wt,ub as $t,uc as Yi,v as Ur,va as ti,vb as pa,vc as ya,w as Nr,wa as ni,wb as Oi,wc as Zi,x as Ir,xa as Yt,xb as Bi,xc as an,y as yr,ya as sa,yb as Xe,yc as $i,z as Fr,za as la,zb as ha,zc as Qi}from"./chunk-EKPYV5BQ.js";function co(){let e=null,n=!1,t=null,i=null;function c(s,u){i=e.requestAnimationFrame(c),t(s,u)}return{start:function(){n!==!0&&t!==null&&e!==null&&(i=e.requestAnimationFrame(c),n=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(i),n=!1},setAnimationLoop:function(s){t=s},setContext:function(s){e=s}}}function bo(e){let n=new WeakMap;function t(m,N){let R=m.array,z=m.usage,y=R.byteLength,M=e.createBuffer();e.bindBuffer(N,M),e.bufferData(N,R,z),m.onUploadCallback();let E;if(R instanceof Float32Array)E=e.FLOAT;else if(typeof Float16Array<"u"&&R instanceof Float16Array)E=e.HALF_FLOAT;else if(R instanceof Uint16Array)m.isFloat16BufferAttribute?E=e.HALF_FLOAT:E=e.UNSIGNED_SHORT;else if(R instanceof Int16Array)E=e.SHORT;else if(R instanceof Uint32Array)E=e.UNSIGNED_INT;else if(R instanceof Int32Array)E=e.INT;else if(R instanceof Int8Array)E=e.BYTE;else if(R instanceof Uint8Array)E=e.UNSIGNED_BYTE;else if(R instanceof Uint8ClampedArray)E=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+R);return{buffer:M,type:E,bytesPerElement:R.BYTES_PER_ELEMENT,version:m.version,size:y}}function i(m,N,R){let z=N.array,y=N.updateRanges;if(e.bindBuffer(R,m),y.length===0)e.bufferSubData(R,0,z);else{y.sort((E,L)=>E.start-L.start);let M=0;for(let E=1;E<y.length;E++){let L=y[M],O=y[E];O.start<=L.start+L.count+1?L.count=Math.max(L.count,O.start+O.count-L.start):(++M,y[M]=O)}y.length=M+1;for(let E=0,L=y.length;E<L;E++){let O=y[E];e.bufferSubData(R,O.start*z.BYTES_PER_ELEMENT,z,O.start,O.count)}N.clearUpdateRanges()}N.onUploadCallback()}function c(m){return m.isInterleavedBufferAttribute&&(m=m.data),n.get(m)}function s(m){m.isInterleavedBufferAttribute&&(m=m.data);let N=n.get(m);N&&(e.deleteBuffer(N.buffer),n.delete(m))}function u(m,N){if(m.isInterleavedBufferAttribute&&(m=m.data),m.isGLBufferAttribute){let z=n.get(m);(!z||z.version<m.version)&&n.set(m,{buffer:m.buffer,type:m.type,bytesPerElement:m.elementSize,version:m.version});return}let R=n.get(m);if(R===void 0)n.set(m,t(m,N));else if(R.version<m.version){if(R.size!==m.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(R.buffer,m,N),R.version=m.version}}return{get:c,remove:s,update:u}}var Po=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Lo=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Do=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,wo=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Uo=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,No=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Io=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,yo=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Fo=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Oo=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Bo=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Go=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ho=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Vo=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Wo=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ko=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,zo=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Xo=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ko=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,qo=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Yo=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Zo=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,$o=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Qo=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Jo=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,jo=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,es=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ts=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ns=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,is="gl_FragColor = linearToOutputTexel( gl_FragColor );",rs=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,as=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,os=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,ss=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,ls=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,cs=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fs=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ds=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,us=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ps=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,hs=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,ms=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,_s=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,gs=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,vs=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Ss=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Es=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ms=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,xs=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ts=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,As=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Rs=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Cs=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,bs=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Ps=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ls=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Ds=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ws=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Us=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ns=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Is=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ys=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Fs=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Os=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Bs=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Gs=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Hs=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Vs=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ws=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ks=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,zs=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Xs=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Ks=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,qs=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ys=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Zs=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,$s=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Qs=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Js=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,js=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,el=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,tl=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,nl=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,il=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,rl=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,al=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ol=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,sl=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ll=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,cl=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,fl=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,dl=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,ul=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,pl=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,hl=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,ml=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,_l=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,gl=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,vl=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Sl=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,El=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ml=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,xl=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Tl=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Al=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Rl=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Cl=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,bl=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Pl=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ll=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Dl=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wl=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ul=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Nl=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Il=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,yl=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Fl=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Ol=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Bl=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Gl=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Hl=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Vl=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Wl=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kl=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,zl=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xl=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Kl=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ql=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Yl=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Zl=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,$l=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ql=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Jl=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jl=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ec=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tc=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,nc=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ic=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,rc=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ac=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,oc=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,we={alphahash_fragment:Po,alphahash_pars_fragment:Lo,alphamap_fragment:Do,alphamap_pars_fragment:wo,alphatest_fragment:Uo,alphatest_pars_fragment:No,aomap_fragment:Io,aomap_pars_fragment:yo,batching_pars_vertex:Fo,batching_vertex:Oo,begin_vertex:Bo,beginnormal_vertex:Go,bsdfs:Ho,iridescence_fragment:Vo,bumpmap_pars_fragment:Wo,clipping_planes_fragment:ko,clipping_planes_pars_fragment:zo,clipping_planes_pars_vertex:Xo,clipping_planes_vertex:Ko,color_fragment:qo,color_pars_fragment:Yo,color_pars_vertex:Zo,color_vertex:$o,common:Qo,defaultnormal_vertex:Jo,displacementmap_pars_vertex:jo,displacementmap_vertex:es,emissivemap_fragment:ts,emissivemap_pars_fragment:ns,colorspace_fragment:is,colorspace_pars_fragment:rs,envmap_fragment:as,envmap_common_pars_fragment:os,envmap_pars_fragment:ss,envmap_pars_vertex:ls,envmap_physical_pars_fragment:Ss,envmap_vertex:cs,fog_vertex:fs,fog_pars_vertex:ds,fog_fragment:us,fog_pars_fragment:ps,gradientmap_pars_fragment:hs,lightmap_pars_fragment:ms,lights_lambert_fragment:_s,lights_lambert_pars_fragment:gs,lights_pars_begin:vs,lights_toon_fragment:Es,lights_toon_pars_fragment:Ms,lights_phong_fragment:xs,lights_phong_pars_fragment:Ts,lights_physical_fragment:As,lights_physical_pars_fragment:Rs,lights_fragment_begin:Cs,lights_fragment_maps:bs,lights_fragment_end:Ps,lightprobes_pars_fragment:Ls,logdepthbuf_fragment:Ds,logdepthbuf_pars_fragment:ws,logdepthbuf_pars_vertex:Us,logdepthbuf_vertex:Ns,map_fragment:Is,map_pars_fragment:ys,map_particle_fragment:Fs,map_particle_pars_fragment:Os,metalnessmap_fragment:Bs,metalnessmap_pars_fragment:Gs,morphinstance_vertex:Hs,morphcolor_vertex:Vs,morphnormal_vertex:Ws,morphtarget_pars_vertex:ks,morphtarget_vertex:zs,normal_fragment_begin:Xs,normal_fragment_maps:Ks,normal_pars_fragment:qs,normal_pars_vertex:Ys,normal_vertex:Zs,normalmap_pars_fragment:$s,clearcoat_normal_fragment_begin:Qs,clearcoat_normal_fragment_maps:Js,clearcoat_pars_fragment:js,iridescence_pars_fragment:el,opaque_fragment:tl,packing:nl,premultiplied_alpha_fragment:il,project_vertex:rl,dithering_fragment:al,dithering_pars_fragment:ol,roughnessmap_fragment:sl,roughnessmap_pars_fragment:ll,shadowmap_pars_fragment:cl,shadowmap_pars_vertex:fl,shadowmap_vertex:dl,shadowmask_pars_fragment:ul,skinbase_vertex:pl,skinning_pars_vertex:hl,skinning_vertex:ml,skinnormal_vertex:_l,specularmap_fragment:gl,specularmap_pars_fragment:vl,tonemapping_fragment:Sl,tonemapping_pars_fragment:El,transmission_fragment:Ml,transmission_pars_fragment:xl,uv_pars_fragment:Tl,uv_pars_vertex:Al,uv_vertex:Rl,worldpos_vertex:Cl,background_vert:bl,background_frag:Pl,backgroundCube_vert:Ll,backgroundCube_frag:Dl,cube_vert:wl,cube_frag:Ul,depth_vert:Nl,depth_frag:Il,distance_vert:yl,distance_frag:Fl,equirect_vert:Ol,equirect_frag:Bl,linedashed_vert:Gl,linedashed_frag:Hl,meshbasic_vert:Vl,meshbasic_frag:Wl,meshlambert_vert:kl,meshlambert_frag:zl,meshmatcap_vert:Xl,meshmatcap_frag:Kl,meshnormal_vert:ql,meshnormal_frag:Yl,meshphong_vert:Zl,meshphong_frag:$l,meshphysical_vert:Ql,meshphysical_frag:Jl,meshtoon_vert:jl,meshtoon_frag:ec,points_vert:tc,points_frag:nc,shadow_vert:ic,shadow_frag:rc,sprite_vert:ac,sprite_frag:oc},ue={common:{diffuse:{value:new Ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Oe}},envmap:{envMap:{value:null},envMapRotation:{value:new Oe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Oe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Oe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Oe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Oe},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Oe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Oe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Oe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Oe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0},uvTransform:{value:new Oe}},sprite:{diffuse:{value:new Ze(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}}},Nt={basic:{uniforms:_t([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:we.meshbasic_vert,fragmentShader:we.meshbasic_frag},lambert:{uniforms:_t([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Ze(0)},envMapIntensity:{value:1}}]),vertexShader:we.meshlambert_vert,fragmentShader:we.meshlambert_frag},phong:{uniforms:_t([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Ze(0)},specular:{value:new Ze(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:we.meshphong_vert,fragmentShader:we.meshphong_frag},standard:{uniforms:_t([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new Ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:we.meshphysical_vert,fragmentShader:we.meshphysical_frag},toon:{uniforms:_t([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new Ze(0)}}]),vertexShader:we.meshtoon_vert,fragmentShader:we.meshtoon_frag},matcap:{uniforms:_t([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:we.meshmatcap_vert,fragmentShader:we.meshmatcap_frag},points:{uniforms:_t([ue.points,ue.fog]),vertexShader:we.points_vert,fragmentShader:we.points_frag},dashed:{uniforms:_t([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:we.linedashed_vert,fragmentShader:we.linedashed_frag},depth:{uniforms:_t([ue.common,ue.displacementmap]),vertexShader:we.depth_vert,fragmentShader:we.depth_frag},normal:{uniforms:_t([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:we.meshnormal_vert,fragmentShader:we.meshnormal_frag},sprite:{uniforms:_t([ue.sprite,ue.fog]),vertexShader:we.sprite_vert,fragmentShader:we.sprite_frag},background:{uniforms:{uvTransform:{value:new Oe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:we.background_vert,fragmentShader:we.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Oe}},vertexShader:we.backgroundCube_vert,fragmentShader:we.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:we.cube_vert,fragmentShader:we.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:we.equirect_vert,fragmentShader:we.equirect_frag},distance:{uniforms:_t([ue.common,ue.displacementmap,{referencePosition:{value:new We},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:we.distance_vert,fragmentShader:we.distance_frag},shadow:{uniforms:_t([ue.lights,ue.fog,{color:{value:new Ze(0)},opacity:{value:1}}]),vertexShader:we.shadow_vert,fragmentShader:we.shadow_frag}};Nt.physical={uniforms:_t([Nt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Oe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Oe},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Oe},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Oe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Oe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Oe},sheen:{value:0},sheenColor:{value:new Ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Oe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Oe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Oe},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Oe},attenuationDistance:{value:0},attenuationColor:{value:new Ze(0)},specularColor:{value:new Ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Oe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Oe},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Oe}}]),vertexShader:we.meshphysical_vert,fragmentShader:we.meshphysical_frag};var yn={r:0,b:0,g:0},sc=new Qt,fo=new Oe;fo.set(-1,0,0,0,1,0,0,0,1);function lc(e,n,t,i,c,s){let u=new Ze(0),m=c===!0?0:1,N,R,z=null,y=0,M=null;function E(g){let D=g.isScene===!0?g.background:null;if(D&&D.isTexture){let S=g.backgroundBlurriness>0;D=n.get(D,S)}return D}function L(g){let D=!1,S=E(g);S===null?f(u,m):S&&S.isColor&&(f(S,1),D=!0);let b=e.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,s):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(e.autoClear||D)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function O(g,D){let S=E(D);S&&S.isCubeTexture?(R===void 0&&(R=new kt(new wn(1,1,1),new Jt({name:"BackgroundCubeMaterial",uniforms:Un(Nt.backgroundCube.uniforms),vertexShader:Nt.backgroundCube.vertexShader,fragmentShader:Nt.backgroundCube.fragmentShader,side:St,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),R.geometry.deleteAttribute("normal"),R.geometry.deleteAttribute("uv"),R.onBeforeRender=function(b,v,o){this.matrixWorld.copyPosition(o.matrixWorld)},Object.defineProperty(R.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(R)),R.material.uniforms.envMap.value=S,R.material.uniforms.backgroundBlurriness.value=D.backgroundBlurriness,R.material.uniforms.backgroundIntensity.value=D.backgroundIntensity,R.material.uniforms.backgroundRotation.value.setFromMatrix4(sc.makeRotationFromEuler(D.backgroundRotation)).transpose(),S.isRenderTargetTexture===!1&&R.material.uniforms.backgroundRotation.value.premultiply(fo),R.material.toneMapped=Je.getTransfer(S.colorSpace)!==Xe,(z!==S||y!==S.version||M!==e.toneMapping)&&(R.material.needsUpdate=!0,z=S,y=S.version,M=e.toneMapping),R.layers.enableAll(),g.unshift(R,R.geometry,R.material,0,0,null)):S&&S.isTexture&&(N===void 0&&(N=new kt(new Ji(2,2),new Jt({name:"BackgroundMaterial",uniforms:Un(Nt.background.uniforms),vertexShader:Nt.background.vertexShader,fragmentShader:Nt.background.fragmentShader,side:en,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),N.geometry.deleteAttribute("normal"),Object.defineProperty(N.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(N)),N.material.uniforms.t2D.value=S,N.material.uniforms.backgroundIntensity.value=D.backgroundIntensity,N.material.toneMapped=Je.getTransfer(S.colorSpace)!==Xe,S.matrixAutoUpdate===!0&&S.updateMatrix(),N.material.uniforms.uvTransform.value.copy(S.matrix),(z!==S||y!==S.version||M!==e.toneMapping)&&(N.material.needsUpdate=!0,z=S,y=S.version,M=e.toneMapping),N.layers.enableAll(),g.unshift(N,N.geometry,N.material,0,0,null))}function f(g,D){g.getRGB(yn,ji(e)),t.buffers.color.setClear(yn.r,yn.g,yn.b,D,s)}function l(){R!==void 0&&(R.geometry.dispose(),R.material.dispose(),R=void 0),N!==void 0&&(N.geometry.dispose(),N.material.dispose(),N=void 0)}return{getClearColor:function(){return u},setClearColor:function(g,D=1){u.set(g),m=D,f(u,m)},getClearAlpha:function(){return m},setClearAlpha:function(g){m=g,f(u,m)},render:L,addToRenderList:O,dispose:l}}function cc(e,n){let t=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},c=M(null),s=c,u=!1;function m(I,X,Z,T,Q){let Y=!1,H=y(I,T,Z,X);s!==H&&(s=H,R(s.object)),Y=E(I,T,Z,Q),Y&&L(I,T,Z,Q),Q!==null&&n.update(Q,e.ELEMENT_ARRAY_BUFFER),(Y||u)&&(u=!1,S(I,X,Z,T),Q!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n.get(Q).buffer))}function N(){return e.createVertexArray()}function R(I){return e.bindVertexArray(I)}function z(I){return e.deleteVertexArray(I)}function y(I,X,Z,T){let Q=T.wireframe===!0,Y=i[X.id];Y===void 0&&(Y={},i[X.id]=Y);let H=I.isInstancedMesh===!0?I.id:0,fe=Y[H];fe===void 0&&(fe={},Y[H]=fe);let K=fe[Z.id];K===void 0&&(K={},fe[Z.id]=K);let j=K[Q];return j===void 0&&(j=M(N()),K[Q]=j),j}function M(I){let X=[],Z=[],T=[];for(let Q=0;Q<t;Q++)X[Q]=0,Z[Q]=0,T[Q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:X,enabledAttributes:Z,attributeDivisors:T,object:I,attributes:{},index:null}}function E(I,X,Z,T){let Q=s.attributes,Y=X.attributes,H=0,fe=Z.getAttributes();for(let K in fe)if(fe[K].location>=0){let ie=Q[K],Ae=Y[K];if(Ae===void 0&&(K==="instanceMatrix"&&I.instanceMatrix&&(Ae=I.instanceMatrix),K==="instanceColor"&&I.instanceColor&&(Ae=I.instanceColor)),ie===void 0||ie.attribute!==Ae||Ae&&ie.data!==Ae.data)return!0;H++}return s.attributesNum!==H||s.index!==T}function L(I,X,Z,T){let Q={},Y=X.attributes,H=0,fe=Z.getAttributes();for(let K in fe)if(fe[K].location>=0){let ie=Y[K];ie===void 0&&(K==="instanceMatrix"&&I.instanceMatrix&&(ie=I.instanceMatrix),K==="instanceColor"&&I.instanceColor&&(ie=I.instanceColor));let Ae={};Ae.attribute=ie,ie&&ie.data&&(Ae.data=ie.data),Q[K]=Ae,H++}s.attributes=Q,s.attributesNum=H,s.index=T}function O(){let I=s.newAttributes;for(let X=0,Z=I.length;X<Z;X++)I[X]=0}function f(I){l(I,0)}function l(I,X){let Z=s.newAttributes,T=s.enabledAttributes,Q=s.attributeDivisors;Z[I]=1,T[I]===0&&(e.enableVertexAttribArray(I),T[I]=1),Q[I]!==X&&(e.vertexAttribDivisor(I,X),Q[I]=X)}function g(){let I=s.newAttributes,X=s.enabledAttributes;for(let Z=0,T=X.length;Z<T;Z++)X[Z]!==I[Z]&&(e.disableVertexAttribArray(Z),X[Z]=0)}function D(I,X,Z,T,Q,Y,H){H===!0?e.vertexAttribIPointer(I,X,Z,Q,Y):e.vertexAttribPointer(I,X,Z,T,Q,Y)}function S(I,X,Z,T){O();let Q=T.attributes,Y=Z.getAttributes(),H=X.defaultAttributeValues;for(let fe in Y){let K=Y[fe];if(K.location>=0){let j=Q[fe];if(j===void 0&&(fe==="instanceMatrix"&&I.instanceMatrix&&(j=I.instanceMatrix),fe==="instanceColor"&&I.instanceColor&&(j=I.instanceColor)),j!==void 0){let ie=j.normalized,Ae=j.itemSize,Ne=n.get(j);if(Ne===void 0)continue;let W=Ne.buffer,he=Ne.type,Se=Ne.bytesPerElement,Re=he===e.INT||he===e.UNSIGNED_INT||j.gpuType===ei;if(j.isInterleavedBufferAttribute){let me=j.data,Ue=me.isInterleavedBuffer===!0?me.stride:me.itemSize,gt=j.offset;if(me.isInstancedInterleavedBuffer||me.isInstancedBufferAttribute){for(let Ce=0;Ce<K.locationSize;Ce++)l(K.location+Ce,me.meshPerAttribute);I.isInstancedMesh!==!0&&T._maxInstanceCount===void 0&&(T._maxInstanceCount=me.meshPerAttribute*me.count)}else for(let Ce=0;Ce<K.locationSize;Ce++)f(K.location+Ce);e.bindBuffer(e.ARRAY_BUFFER,W);for(let Ce=0;Ce<K.locationSize;Ce++)D(K.location+Ce,Ae/K.locationSize,he,ie,Ue*Se,(gt+Ae/K.locationSize*Ce)*Se,Re)}else{if(j.isInstancedBufferAttribute){for(let me=0;me<K.locationSize;me++)l(K.location+me,j.meshPerAttribute);I.isInstancedMesh!==!0&&T._maxInstanceCount===void 0&&(T._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let me=0;me<K.locationSize;me++)f(K.location+me);e.bindBuffer(e.ARRAY_BUFFER,W);for(let me=0;me<K.locationSize;me++)D(K.location+me,Ae/K.locationSize,he,ie,Ae*Se,Ae/K.locationSize*me*Se,Re)}}else if(H!==void 0){let ie=H[fe];if(ie!==void 0)switch(ie.length){case 2:e.vertexAttrib2fv(K.location,ie);break;case 3:e.vertexAttrib3fv(K.location,ie);break;case 4:e.vertexAttrib4fv(K.location,ie);break;default:e.vertexAttrib1fv(K.location,ie)}}}}g()}function b(){q();for(let I in i){let X=i[I];for(let Z in X){let T=X[Z];for(let Q in T){let Y=T[Q];for(let H in Y)z(Y[H].object),delete Y[H];delete T[Q]}}delete i[I]}}function v(I){if(i[I.id]===void 0)return;let X=i[I.id];for(let Z in X){let T=X[Z];for(let Q in T){let Y=T[Q];for(let H in Y)z(Y[H].object),delete Y[H];delete T[Q]}}delete i[I.id]}function o(I){for(let X in i){let Z=i[X];for(let T in Z){let Q=Z[T];if(Q[I.id]===void 0)continue;let Y=Q[I.id];for(let H in Y)z(Y[H].object),delete Y[H];delete Q[I.id]}}}function p(I){for(let X in i){let Z=i[X],T=I.isInstancedMesh===!0?I.id:0,Q=Z[T];if(Q!==void 0){for(let Y in Q){let H=Q[Y];for(let fe in H)z(H[fe].object),delete H[fe];delete Q[Y]}delete Z[T],Object.keys(Z).length===0&&delete i[X]}}}function q(){w(),u=!0,s!==c&&(s=c,R(s.object))}function w(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:m,reset:q,resetDefaultState:w,dispose:b,releaseStatesOfGeometry:v,releaseStatesOfObject:p,releaseStatesOfProgram:o,initAttributes:O,enableAttribute:f,disableUnusedAttributes:g}}function fc(e,n,t){let i;function c(N){i=N}function s(N,R){e.drawArrays(i,N,R),t.update(R,i,1)}function u(N,R,z){z!==0&&(e.drawArraysInstanced(i,N,R,z),t.update(R,i,z))}function m(N,R,z){if(z===0)return;n.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,N,0,R,0,z);let M=0;for(let E=0;E<z;E++)M+=R[E];t.update(M,i,1)}this.setMode=c,this.render=s,this.renderInstances=u,this.renderMultiDraw=m}function dc(e,n,t,i){let c;function s(){if(c!==void 0)return c;if(n.has("EXT_texture_filter_anisotropic")===!0){let o=n.get("EXT_texture_filter_anisotropic");c=e.getParameter(o.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else c=0;return c}function u(o){return!(o!==Ft&&i.convert(o)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function m(o){let p=o===wt&&(n.has("EXT_color_buffer_half_float")||n.has("EXT_color_buffer_float"));return!(o!==Ct&&o!==yt&&!p&&i.convert(o)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function N(o){if(o==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";o="mediump"}return o==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let R=t.precision!==void 0?t.precision:"highp",z=N(R);z!==R&&(He("WebGLRenderer:",R,"not supported, using",z,"instead."),R=z);let y=t.reversedDepthBuffer===!0&&n.has("EXT_clip_control"),M=t.logarithmicDepthBuffer===!0&&y===!1;t.reversedDepthBuffer===!0&&y===!1&&He("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&y===!0&&He("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let E=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),L=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),O=e.getParameter(e.MAX_TEXTURE_SIZE),f=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),l=e.getParameter(e.MAX_VERTEX_ATTRIBS),g=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),D=e.getParameter(e.MAX_VARYING_VECTORS),S=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),b=e.getParameter(e.MAX_SAMPLES),v=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:N,textureFormatReadable:u,textureTypeReadable:m,precision:R,logarithmicDepthBuffer:M,reversedDepthBuffer:y,maxTextures:E,maxVertexTextures:L,maxTextureSize:O,maxCubemapSize:f,maxAttributes:l,maxVertexUniforms:g,maxVaryings:D,maxFragmentUniforms:S,maxSamples:b,samples:v}}function uc(e){let n=this,t=null,i=0,c=!1,s=!1,u=new Na,m=new Oe,N={value:null,needsUpdate:!1};this.uniform=N,this.numPlanes=0,this.numIntersection=0,this.init=function(y,M){let E=y.length!==0||M||i!==0||c;return c=M,i=y.length,E},this.beginShadows=function(){s=!0,z(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(y,M){t=z(y,M,0)},this.setState=function(y,M,E){let L=y.clippingPlanes,O=y.clipIntersection,f=y.clipShadows,l=e.get(y);if(!c||L===null||L.length===0||s&&!f)s?z(null):R();else{let g=s?0:i,D=g*4,S=l.clippingState||null;N.value=S,S=z(L,M,D,E);for(let b=0;b!==D;++b)S[b]=t[b];l.clippingState=S,this.numIntersection=O?this.numPlanes:0,this.numPlanes+=g}};function R(){N.value!==t&&(N.value=t,N.needsUpdate=i>0),n.numPlanes=i,n.numIntersection=0}function z(y,M,E,L){let O=y!==null?y.length:0,f=null;if(O!==0){if(f=N.value,L!==!0||f===null){let l=E+O*4,g=M.matrixWorldInverse;m.getNormalMatrix(g),(f===null||f.length<l)&&(f=new Float32Array(l));for(let D=0,S=E;D!==O;++D,S+=4)u.copy(y[D]).applyMatrix4(g,m),u.normal.toArray(f,S),f[S+3]=u.constant}N.value=f,N.needsUpdate=!0}return n.numPlanes=O,n.numIntersection=0,f}}var _n=class extends bt{constructor(n=1,t={}){super(n,n,t),this.isWebGLCubeRenderTarget=!0;let i={width:n,height:n,depth:1},c=[i,i,i,i,i,i];this.texture=new Zi(c),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(n,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},c=new wn(5,5,5),s=new Jt({name:"CubemapFromEquirect",uniforms:Un(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:St,blending:qt});s.uniforms.tEquirect.value=t;let u=new kt(c,s),m=t.minFilter;return t.minFilter===Ht&&(t.minFilter=At),new In(1,10,this).update(n,u),t.minFilter=m,u.geometry.dispose(),u.material.dispose(),this}clear(n,t=!0,i=!0,c=!0){let s=n.getRenderTarget();for(let u=0;u<6;u++)n.setRenderTarget(this,u),n.clear(t,i,c);n.setRenderTarget(s)}},Wa=256,pc=3,hc=20,uo=256,po=16,mc=3,_c=new We,gc=new Ze,On=class e{constructor(n){this._renderer=n,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new In(1,10,null),this._boxMesh=new kt(new wn(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(n,t=0,i=.1,c=100,s={}){let{size:u=256,position:m=_c}=s,N=this._renderer;this._setSize(u);let R=this._allocateTarget(),z=this._getSourceTarget(!0);t>0&&(z.texture.mipmapsAutoUpdate=!1);let y=N.autoClear,M=N.autoClearColor,E=N.autoClearDepth,L=N.autoClearStencil,O=n.background;N.autoClear=!0,N.autoClearColor=!0,N.autoClearDepth=!0,N.autoClearStencil=!0,O===null&&(n.background=N.getClearColor(gc));let f=new In(i,c,z);return f.position.copy(m),f.update(N,n),N.autoClear=y,N.autoClearColor=M,N.autoClearDepth=E,N.autoClearStencil=L,n.background=O,t>0&&(z.texture.mipmapsAutoUpdate=!0,this._blur(R,t)),this._applyPMREM(R),R}fromEquirectangular(n,t=null){return this._fromTexture(n,t)}fromCubemap(n,t=null){return this._fromTexture(n,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xa(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=za(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(n,t){return t>0?1-Math.sqrt(1-n/t):0}_setSize(n){this._cubeSize=Math.max(Wa,Ca(n))}_fromTexture(n,t){n.mapping===dn||n.mapping===nn?this._setSize(n.image.length===0?Wa:n.image[0].width||n.image[0].image.width):this._setSize(n.image.width/4);let i=t||this._allocateTarget();return this._textureToCubemap(n),this._applyPMREM(i),i}_allocateTarget(){let n=this._cubeSize,t=ka(n,!1,!1),i=Math.log2(n)-pc;for(let c=0;c<=i;c++)t.texture.mipmaps.push({width:n>>c,height:n>>c});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(n=!1){let t=this._cubeSize,i=this._sourceTarget;return(i===null||i.width!==t||n&&i.depthBuffer===!1)&&(i!==null&&i.dispose(),this._sourceTarget=ka(t,!0,n)),this._sourceTarget}_compileMaterial(n){this._boxMesh.material=n,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(n,t,i){let c=this._boxMesh,s=this._cubeCamera;c.material=i,s.renderTarget=n,s.activeMipmapLevel=t;let u=n.width>>t;n.viewport.set(0,0,u,u),s.update(this._renderer,c),n.viewport.set(0,0,n.width,n.height)}_textureToCubemap(n){let t;n.mapping===dn||n.mapping===nn?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xa()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=n.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=za()),t=this._equirectMaterial),t.uniforms.envMap.value=n,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(n){this._ggxMaterial===null&&(this._ggxMaterial=vc(),this._integrationMaterial=Sc());let t=this._cubeSize,i=n.texture.mipmaps.length-1,c=this._ggxMaterial.uniforms;c.envMap.value=this._sourceTarget.texture;let s=this._integrationMaterial.uniforms;s.envMap.value=this._sourceTarget.texture,s.sourceLod.value=Math.log2(t/po);for(let u=0;u<=i;u++){let m=e.lodToRoughness(u,i);if(u>i-mc)s.roughness.value=m,this._renderCube(n,u,this._integrationMaterial);else{let N=m>0?Math.log2(t)+.5*Math.log2(6/(uo*Math.pow(m,4)))+.5:0;c.roughness.value=m,c.lodBias.value=N,this._renderCube(n,u,this._ggxMaterial)}}}_blur(n,t){this._blurMaterial===null&&(this._blurMaterial=Ec());let i=this._blurMaterial,c=i.uniforms,s=this._sourceTarget;c.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,c.envMap.value=s.texture,this._renderCube(n,0,i),c.envMap.value=n.texture,this._renderCube(s,0,i)}};function ka(e,n,t){return new _n(e,{minFilter:Ht,generateMipmaps:n,type:wt,colorSpace:Oi,depthBuffer:t})}function gn(e,n,t){return new Jt({name:e,uniforms:n,vertexShader:we.cube_vert,fragmentShader:t,side:St,blending:qt,depthTest:!1,depthWrite:!1})}function vc(){return gn("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${uo}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Sc(){return gn("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:po}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Ec(){return gn("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${hc}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function za(){return gn("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function Xa(){return gn("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function Mc(e){let n=new WeakMap,t=new WeakMap,i=null;function c(M,E=!1){return M==null?null:E?u(M):s(M)}function s(M){if(M&&M.isTexture){let E=M.mapping;if(E===En||E===Mn)if(n.has(M)){let L=n.get(M).texture;return m(L,M.mapping)}else{let L=M.image;if(L&&L.height>0){let O=new _n(L.height);return O.fromEquirectangularTexture(e,M),n.set(M,O),M.addEventListener("dispose",R),m(O.texture,M.mapping)}else return null}}return M}function u(M){if(M&&M.isTexture&&M.isPMREMTexture!==!0){let E=M.mapping,L=E===En||E===Mn,O=E===dn||E===nn;if(L||O){let f=t.get(M),l=f!==void 0?f.texture.pmremVersion:0;if(M.isRenderTargetTexture&&M.pmremVersion!==l)return i===null&&(i=new On(e)),f=L?i.fromEquirectangular(M,f):i.fromCubemap(M,f),f.texture.pmremVersion=M.pmremVersion,t.set(M,f),f.texture;if(f!==void 0)return f.texture;{let g=M.image;return L&&g&&g.height>0||O&&g&&N(g)?(i===null&&(i=new On(e)),f=L?i.fromEquirectangular(M):i.fromCubemap(M),f.texture.pmremVersion=M.pmremVersion,t.set(M,f),M.addEventListener("dispose",z),f.texture):null}}}return M}function m(M,E){return E===En?M.mapping=dn:E===Mn&&(M.mapping=nn),M}function N(M){let E=0,L=6;for(let O=0;O<L;O++)M[O]!==void 0&&E++;return E===L}function R(M){let E=M.target;E.removeEventListener("dispose",R);let L=n.get(E);L!==void 0&&(n.delete(E),L.dispose())}function z(M){let E=M.target;E.removeEventListener("dispose",z);let L=t.get(E);L!==void 0&&(t.delete(E),L.dispose())}function y(){n=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:c,dispose:y}}function xc(e){let n={};function t(i){if(n[i]!==void 0)return n[i];let c=e.getExtension(i);return n[i]=c,c}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let c=t(i);return c===null&&Ma("WebGLRenderer: "+i+" extension not supported."),c}}}function Tc(e,n,t,i){let c={},s=new WeakMap,u=new FinalizationRegistry(L=>delete c[L]);function m(L){N(L.target)}function N(L){L.index!==null&&n.remove(L.index);for(let f in L.attributes)n.remove(L.attributes[f]);L.removeEventListener("dispose",m),delete c[L.id],u.unregister(L);let O=s.get(L);O&&(n.remove(O),s.delete(L)),i.releaseStatesOfGeometry(L),L.isInstancedBufferGeometry===!0&&delete L._maxInstanceCount,t.memory.geometries--}function R(L,O){return c[O.id]!==void 0||(O.addEventListener("dispose",m),c[O.id]=new WeakRef(O),u.register(O,O.id,O),t.memory.geometries++),O}function z(L){let O=L.attributes;for(let f in O)n.update(O[f],e.ARRAY_BUFFER)}function y(L){let O=L.index,f=L.attributes.position,l=0;if(f===void 0)return;let g=O!==null?O.array.length:f.array.length/3-1,D=f.count>=65535?Ua:wa,S=new D(Math.ceil(g/3)*6,1),b=S.array;if(O!==null){let o=O.array;l=O.version;for(let p=0,q=0;p<g;p+=3){let w=o[p+0],I=o[p+1],X=o[p+2];b[q++]=w,b[q++]=I,b[q++]=I,b[q++]=X,b[q++]=X,b[q++]=w}}else{l=f.version;for(let o=0,p=0;o<g;o+=3){let q=o+0,w=o+1,I=o+2;b[p++]=q,b[p++]=w,b[p++]=w,b[p++]=I,b[p++]=I,b[p++]=q}}S.version=l;let v=s.get(L);v&&n.remove(v),s.set(L,S)}function M(L){let O=s.get(L);if(O){let f=L.index;f!==null&&O.version<f.version&&y(L)}else y(L);return s.get(L)}function E(){for(let L in c){let O=c[L].deref();O!==void 0&&N(O)}}return{get:R,update:z,getWireframeAttribute:M,dispose:E}}function Ac(e,n,t){let i;function c(y){i=y}let s,u;function m(y){s=y.type,u=y.bytesPerElement}function N(y,M){e.drawElements(i,M,s,y*u),t.update(M,i,1)}function R(y,M,E){E!==0&&(e.drawElementsInstanced(i,M,s,y*u,E),t.update(M,i,E))}function z(y,M,E){if(E===0)return;n.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,M,0,s,y,0,E);let O=0;for(let f=0;f<E;f++)O+=M[f];t.update(O,i,1)}this.setMode=c,this.setIndex=m,this.render=N,this.renderInstances=R,this.renderMultiDraw=z}function Rc(e){let n={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,u,m){switch(t.calls++,u){case e.TRIANGLES:t.triangles+=m*(s/3);break;case e.LINES:t.lines+=m*(s/2);break;case e.LINE_STRIP:t.lines+=m*(s-1);break;case e.LINE_LOOP:t.lines+=m*s;break;case e.POINTS:t.points+=m*s;break;default:Ye("WebGLInfo: Unknown draw mode:",u);break}}function c(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:n,render:t,programs:null,autoReset:!0,reset:c,update:i}}function Cc(e,n,t){let i=new WeakMap,c=new mt;function s(u,m,N){let R=u.morphTargetInfluences,z=m.morphAttributes.position||m.morphAttributes.normal||m.morphAttributes.color,y=z!==void 0?z.length:0,M=i.get(m);if(M===void 0||M.count!==y){let q=function(){o.dispose(),i.delete(m),m.removeEventListener("dispose",q)};M!==void 0&&M.texture.dispose();let E=m.morphAttributes.position!==void 0,L=m.morphAttributes.normal!==void 0,O=m.morphAttributes.color!==void 0,f=m.morphAttributes.position||[],l=m.morphAttributes.normal||[],g=m.morphAttributes.color||[],D=0;E===!0&&(D=1),L===!0&&(D=2),O===!0&&(D=3);let S=m.attributes.position.count*D,b=1;S>n.maxTextureSize&&(b=Math.ceil(S/n.maxTextureSize),S=n.maxTextureSize);let v=new Float32Array(S*b*4*y),o=new Xi(v,S,b,y);o.type=yt,o.needsUpdate=!0;let p=D*4;for(let w=0;w<y;w++){let I=f[w],X=l[w],Z=g[w],T=S*b*4*w;for(let Q=0;Q<I.count;Q++){let Y=Q*p;E===!0&&(c.fromBufferAttribute(I,Q),v[T+Y+0]=c.x,v[T+Y+1]=c.y,v[T+Y+2]=c.z,v[T+Y+3]=0),L===!0&&(c.fromBufferAttribute(X,Q),v[T+Y+4]=c.x,v[T+Y+5]=c.y,v[T+Y+6]=c.z,v[T+Y+7]=0),O===!0&&(c.fromBufferAttribute(Z,Q),v[T+Y+8]=c.x,v[T+Y+9]=c.y,v[T+Y+10]=c.z,v[T+Y+11]=Z.itemSize===4?c.w:1)}}M={count:y,texture:o,size:new ht(S,b)},i.set(m,M),m.addEventListener("dispose",q)}if(u.isInstancedMesh===!0&&u.morphTexture!==null)N.getUniforms().setValue(e,"morphTexture",u.morphTexture,t);else{let E=0;for(let O=0;O<R.length;O++)E+=R[O];let L=m.morphTargetsRelative?1:1-E;N.getUniforms().setValue(e,"morphTargetBaseInfluence",L),N.getUniforms().setValue(e,"morphTargetInfluences",R)}N.getUniforms().setValue(e,"morphTargetsTexture",M.texture,t),N.getUniforms().setValue(e,"morphTargetsTextureSize",M.size)}return{update:s}}function bc(e,n,t,i,c){let s=new WeakMap;function u(R){let z=c.render.frame,y=R.geometry,M=n.get(R,y);if(s.get(M)!==z&&(n.update(M),s.set(M,z)),R.isInstancedMesh&&(R.hasEventListener("dispose",N)===!1&&R.addEventListener("dispose",N),s.get(R)!==z&&(t.update(R.instanceMatrix,e.ARRAY_BUFFER),R.instanceColor!==null&&t.update(R.instanceColor,e.ARRAY_BUFFER),s.set(R,z))),R.isSkinnedMesh){let E=R.skeleton;s.get(E)!==z&&(E.update(),s.set(E,z))}return M}function m(){s=new WeakMap}function N(R){let z=R.target;z.removeEventListener("dispose",N),i.releaseStatesOfObject(z),t.remove(z.instanceMatrix),z.instanceColor!==null&&t.remove(z.instanceColor)}return{update:u,dispose:m}}var Pc={[qn]:"LINEAR_TONE_MAPPING",[Yn]:"REINHARD_TONE_MAPPING",[Zn]:"CINEON_TONE_MAPPING",[$n]:"ACES_FILMIC_TONE_MAPPING",[Jn]:"AGX_TONE_MAPPING",[jn]:"NEUTRAL_TONE_MAPPING",[Qn]:"CUSTOM_TONE_MAPPING"};function Lc(e,n,t,i,c,s){let u=new bt(n,t,{type:e,depthBuffer:c,stencilBuffer:s,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),m=null,N=null,R=null,z=new qi;z.setAttribute("position",new Ki([-1,3,0,-1,-1,0,3,-1,0],3)),z.setAttribute("uv",new Ki([0,2,0,0,2,0],2));let y=new Oa({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),M=new kt(z,y),E=new Ha(-1,1,1,-1,0,1),L=null,O=null,f=!1,l,g=null,D=[],S=!1;this.setSize=function(b,v){u.setSize(b,v),m!==null&&m.setSize(b,v),N!==null&&N.setSize(b,v);for(let o=0;o<D.length;o++){let p=D[o];p.setSize&&p.setSize(b,v)}},this.setEffects=function(b){D=b,S=D.length>0&&D[0].isRenderPass===!0;let v=u.width,o=u.height;D.length>0&&m===null&&(m=new bt(v,o,{type:wt,depthBuffer:!1,stencilBuffer:!1}),N=new bt(v,o,{type:wt,depthBuffer:!1,stencilBuffer:!1}));let p=c===!0&&D.some(q=>q.needsDepthTexture===!0);p!==(u.depthTexture!==null)&&(p===!0&&R===null&&(R=new an(v,o),s===!0&&(R.format=Wt,R.type=Yt)),u.dispose(),u.depthTexture=p?R:null,u.resolveDepthBuffer=p,u.storeMultisampledDepthBuffer=p);for(let q=0;q<D.length;q++){let w=D[q];w.setSize&&w.setSize(v,o),p&&w.needsDepthTexture===!0&&w.setDepthTexture&&w.setDepthTexture(R)}},this.begin=function(b,v){if(f||b.toneMapping===Dt&&D.length===0)return!1;if(g=v,v!==null){let o=v.width,p=v.height;(u.width!==o||u.height!==p)&&this.setSize(o,p)}return S===!1&&b.setRenderTarget(u),l=b.toneMapping,b.toneMapping=Dt,!0},this.hasRenderPass=function(){return S},this.end=function(b,v){b.toneMapping=l,f=!0;let o=u,p=m;for(let q=0;q<D.length;q++){let w=D[q];w.enabled!==!1&&(w.render(b,p,o,v),w.needsSwap!==!1&&(o=p,p=p===m?N:m))}if(L!==b.outputColorSpace||O!==b.toneMapping){L=b.outputColorSpace,O=b.toneMapping,y.defines={},Je.getTransfer(L)===Xe&&(y.defines.SRGB_TRANSFER="");let q=Pc[O];q&&(y.defines[q]=""),y.needsUpdate=!0}y.uniforms.tDiffuse.value=o.texture,b.setRenderTarget(g),b.render(M,E),g=null,f=!1},this.isCompositing=function(){return f},this.dispose=function(){u.dispose(),m!==null&&m.dispose(),N!==null&&N.dispose(),z.dispose(),y.dispose()}}var ho=new ba,mo=new an(1,1),_o=new $i(1),go=new Xi,vo=new Pa,So=new Zi,Ka=[],qa=[],Ya=new Float32Array(16),Za=new Float32Array(9),$a=new Float32Array(4);function sn(e,n,t){let i=e[0];if(i<=0||i>0)return e;let c=n*t,s=Ka[c];if(s===void 0&&(s=new Float32Array(c),Ka[c]=s),n!==0){i.toArray(s,0);for(let u=1,m=0;u!==n;++u)m+=t,e[u].toArray(s,m)}return s}function rt(e,n){if(e.length!==n.length)return!1;for(let t=0,i=e.length;t<i;t++)if(e[t]!==n[t])return!1;return!0}function at(e,n){for(let t=0,i=n.length;t<i;t++)e[t]=n[t]}function Bn(e,n){let t=qa[n];t===void 0&&(t=new Int32Array(n),qa[n]=t);for(let i=0;i!==n;++i)t[i]=e.allocateTextureUnit();return t}function Dc(e,n){let t=this.cache;t[0]!==n&&(e.uniform1f(this.addr,n),t[0]=n)}function wc(e,n){let t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2f(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(rt(t,n))return;e.uniform2fv(this.addr,n),at(t,n)}}function Uc(e,n){let t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3f(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else if(n.r!==void 0)(t[0]!==n.r||t[1]!==n.g||t[2]!==n.b)&&(e.uniform3f(this.addr,n.r,n.g,n.b),t[0]=n.r,t[1]=n.g,t[2]=n.b);else{if(rt(t,n))return;e.uniform3fv(this.addr,n),at(t,n)}}function Nc(e,n){let t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4f(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(rt(t,n))return;e.uniform4fv(this.addr,n),at(t,n)}}function Ic(e,n){let t=this.cache,i=n.elements;if(i===void 0){if(rt(t,n))return;e.uniformMatrix2fv(this.addr,!1,n),at(t,n)}else{if(rt(t,i))return;$a.set(i),e.uniformMatrix2fv(this.addr,!1,$a),at(t,i)}}function yc(e,n){let t=this.cache,i=n.elements;if(i===void 0){if(rt(t,n))return;e.uniformMatrix3fv(this.addr,!1,n),at(t,n)}else{if(rt(t,i))return;Za.set(i),e.uniformMatrix3fv(this.addr,!1,Za),at(t,i)}}function Fc(e,n){let t=this.cache,i=n.elements;if(i===void 0){if(rt(t,n))return;e.uniformMatrix4fv(this.addr,!1,n),at(t,n)}else{if(rt(t,i))return;Ya.set(i),e.uniformMatrix4fv(this.addr,!1,Ya),at(t,i)}}function Oc(e,n){let t=this.cache;t[0]!==n&&(e.uniform1i(this.addr,n),t[0]=n)}function Bc(e,n){let t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2i(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(rt(t,n))return;e.uniform2iv(this.addr,n),at(t,n)}}function Gc(e,n){let t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3i(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else{if(rt(t,n))return;e.uniform3iv(this.addr,n),at(t,n)}}function Hc(e,n){let t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4i(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(rt(t,n))return;e.uniform4iv(this.addr,n),at(t,n)}}function Vc(e,n){let t=this.cache;t[0]!==n&&(e.uniform1ui(this.addr,n),t[0]=n)}function Wc(e,n){let t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2ui(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(rt(t,n))return;e.uniform2uiv(this.addr,n),at(t,n)}}function kc(e,n){let t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3ui(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else{if(rt(t,n))return;e.uniform3uiv(this.addr,n),at(t,n)}}function zc(e,n){let t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4ui(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(rt(t,n))return;e.uniform4uiv(this.addr,n),at(t,n)}}function Gn(e){return e.version===0&&(e.compareFunction=Vi,e.needsUpdate=!0),e}function Xc(e,n,t){let i=this.cache,c=t.allocateTextureUnit();i[0]!==c&&(e.uniform1i(this.addr,c),i[0]=c);let s;this.type===e.SAMPLER_2D_SHADOW?s=Gn(mo):s=ho,t.setTexture2D(n||s,c)}function Kc(e,n,t){let i=this.cache,c=t.allocateTextureUnit();i[0]!==c&&(e.uniform1i(this.addr,c),i[0]=c),t.setTexture3D(n||vo,c)}function qc(e,n,t){let i=this.cache,c=t.allocateTextureUnit();i[0]!==c&&(e.uniform1i(this.addr,c),i[0]=c);let s;this.type===e.SAMPLER_CUBE_SHADOW?s=Gn(_o):s=So,t.setTextureCube(n||s,c)}function Yc(e,n,t){let i=this.cache,c=t.allocateTextureUnit();i[0]!==c&&(e.uniform1i(this.addr,c),i[0]=c),t.setTexture2DArray(n||go,c)}function Zc(e){switch(e){case 5126:return Dc;case 35664:return wc;case 35665:return Uc;case 35666:return Nc;case 35674:return Ic;case 35675:return yc;case 35676:return Fc;case 5124:case 35670:return Oc;case 35667:case 35671:return Bc;case 35668:case 35672:return Gc;case 35669:case 35673:return Hc;case 5125:return Vc;case 36294:return Wc;case 36295:return kc;case 36296:return zc;case 35678:case 36198:case 36298:case 36306:case 35682:return Xc;case 35679:case 36299:case 36307:return Kc;case 35680:case 36300:case 36308:case 36293:return qc;case 36289:case 36303:case 36311:case 36292:return Yc}}function $c(e,n){e.uniform1fv(this.addr,n)}function Qc(e,n){let t=sn(n,this.size,2);e.uniform2fv(this.addr,t)}function Jc(e,n){let t=sn(n,this.size,3);e.uniform3fv(this.addr,t)}function jc(e,n){let t=sn(n,this.size,4);e.uniform4fv(this.addr,t)}function ef(e,n){let t=sn(n,this.size,4);e.uniformMatrix2fv(this.addr,!1,t)}function tf(e,n){let t=sn(n,this.size,9);e.uniformMatrix3fv(this.addr,!1,t)}function nf(e,n){let t=sn(n,this.size,16);e.uniformMatrix4fv(this.addr,!1,t)}function rf(e,n){e.uniform1iv(this.addr,n)}function af(e,n){e.uniform2iv(this.addr,n)}function of(e,n){e.uniform3iv(this.addr,n)}function sf(e,n){e.uniform4iv(this.addr,n)}function lf(e,n){e.uniform1uiv(this.addr,n)}function cf(e,n){e.uniform2uiv(this.addr,n)}function ff(e,n){e.uniform3uiv(this.addr,n)}function df(e,n){e.uniform4uiv(this.addr,n)}function uf(e,n,t){let i=this.cache,c=n.length,s=Bn(t,c);rt(i,s)||(e.uniform1iv(this.addr,s),at(i,s));let u;this.type===e.SAMPLER_2D_SHADOW?u=Gn(mo):u=ho;for(let m=0;m!==c;++m)t.setTexture2D(n[m]||u,s[m])}function pf(e,n,t){let i=this.cache,c=n.length,s=Bn(t,c);rt(i,s)||(e.uniform1iv(this.addr,s),at(i,s));for(let u=0;u!==c;++u)t.setTexture3D(n[u]||vo,s[u])}function hf(e,n,t){let i=this.cache,c=n.length,s=Bn(t,c);rt(i,s)||(e.uniform1iv(this.addr,s),at(i,s));let u;this.type===e.SAMPLER_CUBE_SHADOW?u=Gn(_o):u=So;for(let m=0;m!==c;++m)t.setTextureCube(n[m]||u,s[m])}function mf(e,n,t){let i=this.cache,c=n.length,s=Bn(t,c);rt(i,s)||(e.uniform1iv(this.addr,s),at(i,s));for(let u=0;u!==c;++u)t.setTexture2DArray(n[u]||go,s[u])}function _f(e){switch(e){case 5126:return $c;case 35664:return Qc;case 35665:return Jc;case 35666:return jc;case 35674:return ef;case 35675:return tf;case 35676:return nf;case 5124:case 35670:return rf;case 35667:case 35671:return af;case 35668:case 35672:return of;case 35669:case 35673:return sf;case 5125:return lf;case 36294:return cf;case 36295:return ff;case 36296:return df;case 35678:case 36198:case 36298:case 36306:case 35682:return uf;case 35679:case 36299:case 36307:return pf;case 35680:case 36300:case 36308:case 36293:return hf;case 36289:case 36303:case 36311:case 36292:return mf}}var ir=class{constructor(n,t,i){this.id=n,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Zc(t.type)}},rr=class{constructor(n,t,i){this.id=n,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=_f(t.type)}},ar=class{constructor(n){this.id=n,this.seq=[],this.map={}}setValue(n,t,i){let c=this.seq;for(let s=0,u=c.length;s!==u;++s){let m=c[s];m.setValue(n,t[m.id],i)}}},tr=/(\w+)(\])?(\[|\.)?/g;function Qa(e,n){e.seq.push(n),e.map[n.id]=n}function gf(e,n,t){let i=e.name,c=i.length;for(tr.lastIndex=0;;){let s=tr.exec(i),u=tr.lastIndex,m=s[1],N=s[2]==="]",R=s[3];if(N&&(m=m|0),R===void 0||R==="["&&u+2===c){Qa(t,R===void 0?new ir(m,e,n):new rr(m,e,n));break}else{let y=t.map[m];y===void 0&&(y=new ar(m),Qa(t,y)),t=y}}}var on=class{constructor(n,t){this.seq=[],this.map={};let i=n.getProgramParameter(t,n.ACTIVE_UNIFORMS);for(let u=0;u<i;++u){let m=n.getActiveUniform(t,u),N=n.getUniformLocation(t,m.name);gf(m,N,this)}let c=[],s=[];for(let u of this.seq)u.type===n.SAMPLER_2D_SHADOW||u.type===n.SAMPLER_CUBE_SHADOW||u.type===n.SAMPLER_2D_ARRAY_SHADOW?c.push(u):s.push(u);c.length>0&&(this.seq=c.concat(s))}setValue(n,t,i,c){let s=this.map[t];s!==void 0&&s.setValue(n,i,c)}setOptional(n,t,i){let c=t[i];c!==void 0&&this.setValue(n,i,c)}static upload(n,t,i,c){for(let s=0,u=t.length;s!==u;++s){let m=t[s],N=i[m.id];N.needsUpdate!==!1&&m.setValue(n,N.value,c)}}static seqWithValue(n,t){let i=[];for(let c=0,s=n.length;c!==s;++c){let u=n[c];u.id in t&&i.push(u)}return i}};function Ja(e,n,t){let i=e.createShader(n);return e.shaderSource(i,t),e.compileShader(i),i}var vf=37297,Sf=0;function Ef(e,n){let t=e.split(`
`),i=[],c=Math.max(n-6,0),s=Math.min(n+6,t.length);for(let u=c;u<s;u++){let m=u+1;i.push(`${m===n?">":" "} ${m}: ${t[u]}`)}return i.join(`
`)}var ja=new Oe;function Mf(e){Je._getMatrix(ja,Je.workingColorSpace,e);let n=`mat3( ${ja.elements.map(t=>t.toFixed(4))} )`;switch(Je.getTransfer(e)){case Bi:return[n,"LinearTransferOETF"];case Xe:return[n,"sRGBTransferOETF"];default:return He("WebGLProgram: Unsupported color space: ",e),[n,"LinearTransferOETF"]}}function eo(e,n,t){let i=e.getShaderParameter(n,e.COMPILE_STATUS),s=(e.getShaderInfoLog(n)||"").trim();if(i&&s==="")return"";let u=/ERROR: 0:(\d+)/.exec(s);if(u){let m=parseInt(u[1]);return t.toUpperCase()+`

`+s+`

`+Ef(e.getShaderSource(n),m)}else return s}function xf(e,n){let t=Mf(n);return[`vec4 ${e}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}var Tf={[qn]:"Linear",[Yn]:"Reinhard",[Zn]:"Cineon",[$n]:"ACESFilmic",[Jn]:"AgX",[jn]:"Neutral",[Qn]:"Custom"};function Af(e,n){let t=Tf[n];return t===void 0?(He("WebGLProgram: Unsupported toneMapping:",n),"vec3 "+e+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+e+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Fn=new We;function Rf(){Je.getLuminanceCoefficients(Fn);let e=Fn.x.toFixed(4),n=Fn.y.toFixed(4),t=Fn.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${n}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Cf(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(mn).join(`
`)}function bf(e){let n=[];for(let t in e){let i=e[t];i!==!1&&n.push("#define "+t+" "+i)}return n.join(`
`)}function Pf(e,n){let t={},i=e.getProgramParameter(n,e.ACTIVE_ATTRIBUTES);for(let c=0;c<i;c++){let s=e.getActiveAttrib(n,c),u=s.name,m=1;s.type===e.FLOAT_MAT2&&(m=2),s.type===e.FLOAT_MAT3&&(m=3),s.type===e.FLOAT_MAT4&&(m=4),t[u]={type:s.type,location:e.getAttribLocation(n,u),locationSize:m}}return t}function mn(e){return e!==""}function to(e,n){let t=n.numSpotLightShadows+n.numSpotLightMaps-n.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,n.numSunLights).replace(/NUM_DIR_LIGHTS/g,n.numDirLights).replace(/NUM_SPOT_LIGHTS/g,n.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,n.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,n.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,n.numPointLights).replace(/NUM_HEMI_LIGHTS/g,n.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,n.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,n.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,n.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,n.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,n.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,n.numLightProbeGrids)}function no(e,n){return e.replace(/NUM_CLIPPING_PLANES/g,n.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,n.numClippingPlanes-n.numClipIntersection)}var Lf=/^[ \t]*#include +<([\w\d./]+)>/gm;function or(e){return e.replace(Lf,Df)}function Df(e,n){let t=we[n];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+n+">");return or(t)}var wf=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function io(e){return e.replace(wf,Uf)}function Uf(e,n,t,i){let c="";for(let s=parseInt(n);s<parseInt(t);s++)c+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return c}function ro(e){let n=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision==="highp"?n+=`
#define HIGH_PRECISION`:e.precision==="mediump"?n+=`
#define MEDIUM_PRECISION`:e.precision==="lowp"&&(n+=`
#define LOW_PRECISION`),n}var Nf={[cn]:"SHADOWMAP_TYPE_PCF",[jt]:"SHADOWMAP_TYPE_VSM"};function If(e){return Nf[e.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var yf={[nn]:"ENVMAP_MODE_REFRACTION"};function Ff(e){return e.envMap===!1?"ENVMAP_MODE_REFLECTION":yf[e.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Of={[jr]:"ENVMAP_BLENDING_MULTIPLY",[ea]:"ENVMAP_BLENDING_MIX",[ta]:"ENVMAP_BLENDING_ADD"};function Bf(e){return e.envMap===!1?"ENVMAP_BLENDING_NONE":Of[e.combine]||"ENVMAP_BLENDING_NONE"}function Gf(e,n,t,i){let c=e.getContext(),s=t.defines,u=t.vertexShader,m=t.fragmentShader,N=If(t),R=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",z=Ff(t),y=Bf(t),M=Cf(t),E=bf(s),L=c.createProgram(),O,f,l=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(O=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E].filter(mn).join(`
`),O.length>0&&(O+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E].filter(mn).join(`
`),f.length>0&&(f+=`
`)):(O=[ro(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+z:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+N:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(mn).join(`
`),f=[ro(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+R:"",t.envMap?"#define "+z:"",t.envMap?"#define "+y:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+N:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Dt?"#define TONE_MAPPING":"",t.toneMapping!==Dt?we.tonemapping_pars_fragment:"",t.toneMapping!==Dt?Af("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",we.colorspace_pars_fragment,xf("linearToOutputTexel",t.outputColorSpace),Rf(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(mn).join(`
`)),u=or(u),u=to(u,t),u=no(u,t),m=or(m),m=to(m,t),m=no(m,t),u=io(u),m=io(m),t.isRawShaderMaterial!==!0&&(l=`#version 300 es
`,O=[M,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+O,f=["#define varying in",t.glslVersion===Wi?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Wi?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let g=l+O+u,D=l+f+m,S=Ja(c,c.VERTEX_SHADER,g),b=Ja(c,c.FRAGMENT_SHADER,D);c.attachShader(L,S),c.attachShader(L,b),t.index0AttributeName!==void 0?c.bindAttribLocation(L,0,t.index0AttributeName):t.hasPositionAttribute===!0&&c.bindAttribLocation(L,0,"position"),c.linkProgram(L);function v(w){if(e.debug.checkShaderErrors){let I=c.getProgramInfoLog(L)||"",X=c.getShaderInfoLog(S)||"",Z=c.getShaderInfoLog(b)||"",T=I.trim(),Q=X.trim(),Y=Z.trim(),H=!0,fe=!0;if(c.getProgramParameter(L,c.LINK_STATUS)===!1)if(H=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(c,L,S,b);else{let K=eo(c,S,"vertex"),j=eo(c,b,"fragment");Ye("WebGLProgram: Shader Error "+c.getError()+" - VALIDATE_STATUS "+c.getProgramParameter(L,c.VALIDATE_STATUS)+`

Material Name: `+w.name+`
Material Type: `+w.type+`

Program Info Log: `+T+`
`+K+`
`+j)}else T!==""?He("WebGLProgram: Program Info Log:",T):(Q===""||Y==="")&&(fe=!1);fe&&(w.diagnostics={runnable:H,programLog:T,vertexShader:{log:Q,prefix:O},fragmentShader:{log:Y,prefix:f}})}c.deleteShader(S),c.deleteShader(b),o=new on(c,L),p=Pf(c,L)}let o;this.getUniforms=function(){return o===void 0&&v(this),o};let p;this.getAttributes=function(){return p===void 0&&v(this),p};let q=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return q===!1&&(q=c.getProgramParameter(L,vf)),q},this.destroy=function(){i.releaseStatesOfProgram(this),c.deleteProgram(L),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Sf++,this.cacheKey=n,this.usedTimes=1,this.program=L,this.vertexShader=S,this.fragmentShader=b,this}var Hf=0,sr=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(n,t,i){let c=this._getShaderCacheForMaterial(n);return c.has(t)===!1&&(c.add(t),t.usedTimes++),c.has(i)===!1&&(c.add(i),i.usedTimes++),this}remove(n){let t=this.materialCache.get(n);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(n),this}getVertexShaderStage(n){return this._getShaderStage(n.vertexShader)}getFragmentShaderStage(n){return this._getShaderStage(n.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(n){let t=this.materialCache,i=t.get(n);return i===void 0&&(i=new Set,t.set(n,i)),i}_getShaderStage(n){let t=this.shaderCache,i=t.get(n);return i===void 0&&(i=new lr(n),t.set(n,i)),i}},lr=class{constructor(n){this.id=Hf++,this.code=n,this.usedTimes=0}};function Vf(e){return e===Zt||e===Pn||e===Ln}function Wf(e,n,t,i,c,s){let u=new La,m=new sr,N=new Set,R=[],z=new Map,y=i.logarithmicDepthBuffer,M={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function E(o){return N.add(o),o===0?"uv":`uv${o}`}function L(o,p,q,w,I,X){let Z=w.fog,T=I.geometry,Q=o.isMeshStandardMaterial||o.isMeshLambertMaterial||o.isMeshPhongMaterial?w.environment:null,Y=o.isMeshStandardMaterial||o.isMeshLambertMaterial&&!o.envMap||o.isMeshPhongMaterial&&!o.envMap,H=n.get(o.envMap||Q,Y),fe=M[o.type],K=i.precision;o.precision!==null&&(K=i.getMaxPrecision(o.precision),K!==o.precision&&He("WebGLProgram.getParameters:",o.precision,"not supported, using",K,"instead."));let j=T.morphAttributes.position||T.morphAttributes.normal||T.morphAttributes.color,ie=j!==void 0?j.length:0,Ae=0;T.morphAttributes.position!==void 0&&(Ae=1),T.morphAttributes.normal!==void 0&&(Ae=2),T.morphAttributes.color!==void 0&&(Ae=3);let Ne,W,he,Se;if(fe){let de=Nt[fe];Ne=de.vertexShader,W=de.fragmentShader}else{Ne=o.vertexShader,W=o.fragmentShader;let de=m.getVertexShaderStage(o),Ve=m.getFragmentShaderStage(o);m.update(o,de,Ve),he=de.id,Se=Ve.id}let Re=e.getRenderTarget(),me=e.state.buffers.depth.getReversed(),Ue=I.isInstancedMesh===!0,gt=I.isBatchedMesh===!0,Ce=!!o.map,qe=!!o.matcap,ke=!!H,Ie=ke&&H.isPMREMTexture===!0,ct=!!o.aoMap,nt=!!o.lightMap,vt=!!o.bumpMap&&o.wireframe===!1,je=!!o.normalMap,Pt=!!o.displacementMap,ot=!!o.emissiveMap,Et=!!o.metalnessMap,Mt=!!o.roughnessMap,xt=o.anisotropy>0,x=o.clearcoat>0,Tt=o.diffuseRoughness>0,$e=o.dispersion>0,Qe=o.retroreflectivity>0,ce=o.iridescence>0,it=o.sheen>0,Te=o.transmission>0,be=xt&&!!o.anisotropyMap,d=x&&!!o.clearcoatMap,r=x&&!!o.clearcoatNormalMap,C=x&&!!o.clearcoatRoughnessMap,$=Tt&&!!o.diffuseRoughnessMap,k=ce&&!!o.iridescenceMap,te=ce&&!!o.iridescenceThicknessMap,se=it&&!!o.sheenColorMap,B=it&&!!o.sheenRoughnessMap,G=!!o.specularMap,re=!!o.specularColorMap,h=!!o.specularIntensityMap,V=Te&&!!o.transmissionMap,F=Te&&!!o.thicknessMap,ae=!!o.gradientMap,ee=!!o.alphaMap,ne=o.alphaTest>0,Me=!!o.alphaHash,De=!!o.extensions,J=Dt;o.toneMapped&&(Re===null||Re.isXRRenderTarget===!0)&&(J=e.toneMapping);let xe=Ie?H.isCompressedCubeTexture?H.image[0].mipmaps:H.mipmaps:null,Le={shaderID:fe,shaderType:o.type,shaderName:o.name,vertexShader:Ne,fragmentShader:W,defines:o.defines,customVertexShaderID:he,customFragmentShaderID:Se,isRawShaderMaterial:o.isRawShaderMaterial===!0,glslVersion:o.glslVersion,precision:K,batching:gt,batchingColor:gt&&I._colorsTexture!==null,instancing:Ue,instancingColor:Ue&&I.instanceColor!==null,instancingMorph:Ue&&I.morphTexture!==null,outputColorSpace:Re===null?e.outputColorSpace:Re.isXRRenderTarget===!0?Re.texture.colorSpace:Je.workingColorSpace,alphaToCoverage:!!o.alphaToCoverage,map:Ce,matcap:qe,envMap:ke,envMapMode:ke&&H.mapping,envMapPMREM:Ie,envMapMaxLod:Ie?xe.length-1:null,envMapSize:Ie?xe[0].width:null,aoMap:ct,lightMap:nt,bumpMap:vt,normalMap:je,displacementMap:Pt,emissiveMap:ot,normalMapObjectSpace:je&&o.normalMapType===ua,normalMapTangentSpace:je&&o.normalMapType===Fi,packedNormalMap:je&&o.normalMapType===Fi&&Vf(o.normalMap.format),metalnessMap:Et,roughnessMap:Mt,anisotropy:xt,anisotropyMap:be,clearcoat:x,clearcoatMap:d,clearcoatNormalMap:r,clearcoatRoughnessMap:C,diffuseRoughness:Tt,diffuseRoughnessMap:$,dispersion:$e,retroreflection:Qe,iridescence:ce,iridescenceMap:k,iridescenceThicknessMap:te,sheen:it,sheenColorMap:se,sheenRoughnessMap:B,specularMap:G,specularColorMap:re,specularIntensityMap:h,transmission:Te,transmissionMap:V,thicknessMap:F,gradientMap:ae,opaque:o.transparent===!1&&o.blending===fn&&o.alphaToCoverage===!1,alphaMap:ee,alphaTest:ne,alphaHash:Me,combine:o.combine,mapUv:Ce&&E(o.map.channel),aoMapUv:ct&&E(o.aoMap.channel),lightMapUv:nt&&E(o.lightMap.channel),bumpMapUv:vt&&E(o.bumpMap.channel),normalMapUv:je&&E(o.normalMap.channel),displacementMapUv:Pt&&E(o.displacementMap.channel),emissiveMapUv:ot&&E(o.emissiveMap.channel),metalnessMapUv:Et&&E(o.metalnessMap.channel),roughnessMapUv:Mt&&E(o.roughnessMap.channel),anisotropyMapUv:be&&E(o.anisotropyMap.channel),clearcoatMapUv:d&&E(o.clearcoatMap.channel),clearcoatNormalMapUv:r&&E(o.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:C&&E(o.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:$&&E(o.diffuseRoughnessMap.channel),iridescenceMapUv:k&&E(o.iridescenceMap.channel),iridescenceThicknessMapUv:te&&E(o.iridescenceThicknessMap.channel),sheenColorMapUv:se&&E(o.sheenColorMap.channel),sheenRoughnessMapUv:B&&E(o.sheenRoughnessMap.channel),specularMapUv:G&&E(o.specularMap.channel),specularColorMapUv:re&&E(o.specularColorMap.channel),specularIntensityMapUv:h&&E(o.specularIntensityMap.channel),transmissionMapUv:V&&E(o.transmissionMap.channel),thicknessMapUv:F&&E(o.thicknessMap.channel),alphaMapUv:ee&&E(o.alphaMap.channel),vertexTangents:!!T.attributes.tangent&&(je||xt),vertexNormals:!!T.attributes.normal,vertexColors:o.vertexColors,vertexAlphas:o.vertexColors===!0&&!!T.attributes.color&&T.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!T.attributes.uv&&(Ce||ee),fog:!!Z,useFog:o.fog===!0,fogExp2:!!Z&&Z.isFogExp2,flatShading:o.wireframe===!1&&(o.flatShading===!0||T.attributes.normal===void 0&&je===!1&&(o.isMeshLambertMaterial||o.isMeshPhongMaterial||o.isMeshStandardMaterial||o.isMeshPhysicalMaterial)),sizeAttenuation:o.sizeAttenuation===!0,logarithmicDepthBuffer:y,reversedDepthBuffer:me,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:T.attributes.position!==void 0,morphTargets:T.morphAttributes.position!==void 0,morphNormals:T.morphAttributes.normal!==void 0,morphColors:T.morphAttributes.color!==void 0,morphTargetsCount:ie,morphTextureStride:Ae,numSunLights:p.sun.length,numDirLights:p.directional.length,numPointLights:p.point.length,numSpotLights:p.spot.length,numSpotLightMaps:p.spotLightMap.length,numRectAreaLights:p.rectArea.length,numHemiLights:p.hemi.length,numSunLightShadows:p.sunShadowMap.length,numDirLightShadows:p.directionalShadowMap.length,numPointLightShadows:p.pointShadowMap.length,numSpotLightShadows:p.spotShadowMap.length,numSpotLightShadowsWithMaps:p.numSpotLightShadowsWithMaps,numLightProbes:p.numLightProbes,numLightProbeGrids:X.filter(de=>de.texture!==null).length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:o.dithering,shadowMapEnabled:e.shadowMap.enabled&&q.length>0,shadowMapType:e.shadowMap.type,toneMapping:J,decodeVideoTexture:Ce&&o.map.isVideoTexture===!0&&Je.getTransfer(o.map.colorSpace)===Xe,decodeVideoTextureEmissive:ot&&o.emissiveMap.isVideoTexture===!0&&Je.getTransfer(o.emissiveMap.colorSpace)===Xe,premultipliedAlpha:o.premultipliedAlpha,doubleSided:o.side===Lt,flipSided:o.side===St,useDepthPacking:o.depthPacking>=0,depthPacking:o.depthPacking||0,index0AttributeName:o.index0AttributeName,extensionClipCullDistance:De&&o.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(De&&o.extensions.multiDraw===!0||gt)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:o.customProgramCacheKey()};return Le.vertexUv1s=N.has(1),Le.vertexUv2s=N.has(2),Le.vertexUv3s=N.has(3),N.clear(),Le}function O(o){let p=[];if(o.shaderID?p.push(o.shaderID):(p.push(o.customVertexShaderID),p.push(o.customFragmentShaderID)),o.defines!==void 0)for(let q in o.defines)p.push(q),p.push(o.defines[q]);return o.isRawShaderMaterial===!1&&(f(p,o),l(p,o),p.push(e.outputColorSpace)),p.push(o.customProgramCacheKey),p.join()}function f(o,p){o.push(p.precision),o.push(p.outputColorSpace),o.push(p.envMapMode),o.push(p.envMapPMREM),o.push(p.envMapMaxLod),o.push(p.envMapSize),o.push(p.mapUv),o.push(p.alphaMapUv),o.push(p.lightMapUv),o.push(p.aoMapUv),o.push(p.bumpMapUv),o.push(p.normalMapUv),o.push(p.displacementMapUv),o.push(p.emissiveMapUv),o.push(p.metalnessMapUv),o.push(p.roughnessMapUv),o.push(p.anisotropyMapUv),o.push(p.clearcoatMapUv),o.push(p.clearcoatNormalMapUv),o.push(p.clearcoatRoughnessMapUv),o.push(p.diffuseRoughnessMapUv),o.push(p.iridescenceMapUv),o.push(p.iridescenceThicknessMapUv),o.push(p.sheenColorMapUv),o.push(p.sheenRoughnessMapUv),o.push(p.specularMapUv),o.push(p.specularColorMapUv),o.push(p.specularIntensityMapUv),o.push(p.transmissionMapUv),o.push(p.thicknessMapUv),o.push(p.combine),o.push(p.fogExp2),o.push(p.sizeAttenuation),o.push(p.morphTargetsCount),o.push(p.numSunLights),o.push(p.numDirLights),o.push(p.numPointLights),o.push(p.numSpotLights),o.push(p.numSpotLightMaps),o.push(p.numHemiLights),o.push(p.numRectAreaLights),o.push(p.numSunLightShadows),o.push(p.numDirLightShadows),o.push(p.numPointLightShadows),o.push(p.numSpotLightShadows),o.push(p.numSpotLightShadowsWithMaps),o.push(p.numLightProbes),o.push(p.numLightProbeGrids),o.push(p.shadowMapType),o.push(p.toneMapping),o.push(p.numClippingPlanes),o.push(p.numClipIntersection),o.push(p.depthPacking)}function l(o,p){u.disableAll(),p.instancing&&u.enable(0),p.instancingColor&&u.enable(1),p.instancingMorph&&u.enable(2),p.matcap&&u.enable(3),p.envMap&&u.enable(4),p.normalMapObjectSpace&&u.enable(5),p.normalMapTangentSpace&&u.enable(6),p.clearcoat&&u.enable(7),p.iridescence&&u.enable(8),p.alphaTest&&u.enable(9),p.vertexColors&&u.enable(10),p.vertexAlphas&&u.enable(11),p.vertexUv1s&&u.enable(12),p.vertexUv2s&&u.enable(13),p.vertexUv3s&&u.enable(14),p.vertexTangents&&u.enable(15),p.anisotropy&&u.enable(16),p.alphaHash&&u.enable(17),p.batching&&u.enable(18),p.dispersion&&u.enable(19),p.retroreflection&&u.enable(24),p.diffuseRoughness&&u.enable(25),p.batchingColor&&u.enable(20),p.gradientMap&&u.enable(21),p.packedNormalMap&&u.enable(22),p.vertexNormals&&u.enable(23),o.push(u.mask),u.disableAll(),p.fog&&u.enable(0),p.useFog&&u.enable(1),p.flatShading&&u.enable(2),p.logarithmicDepthBuffer&&u.enable(3),p.reversedDepthBuffer&&u.enable(4),p.skinning&&u.enable(5),p.morphTargets&&u.enable(6),p.morphNormals&&u.enable(7),p.morphColors&&u.enable(8),p.premultipliedAlpha&&u.enable(9),p.shadowMapEnabled&&u.enable(10),p.doubleSided&&u.enable(11),p.flipSided&&u.enable(12),p.useDepthPacking&&u.enable(13),p.dithering&&u.enable(14),p.transmission&&u.enable(15),p.sheen&&u.enable(16),p.opaque&&u.enable(17),p.pointsUvs&&u.enable(18),p.decodeVideoTexture&&u.enable(19),p.decodeVideoTextureEmissive&&u.enable(20),p.alphaToCoverage&&u.enable(21),p.numLightProbeGrids>0&&u.enable(22),p.hasPositionAttribute&&u.enable(23),o.push(u.mask)}function g(o){let p=M[o.type],q;if(p){let w=Nt[p];q=Fa.clone(w.uniforms)}else q=o.uniforms;return q}function D(o,p){let q=z.get(p);return q!==void 0?++q.usedTimes:(q=new Gf(e,p,o,c),R.push(q),z.set(p,q)),q}function S(o){if(--o.usedTimes===0){let p=R.indexOf(o);R[p]=R[R.length-1],R.pop(),z.delete(o.cacheKey),o.destroy()}}function b(o){m.remove(o)}function v(){m.dispose()}return{getParameters:L,getProgramCacheKey:O,getUniforms:g,acquireProgram:D,releaseProgram:S,releaseShaderCache:b,programs:R,dispose:v}}function kf(){let e=new WeakMap;function n(u){return e.has(u)}function t(u){let m=e.get(u);return m===void 0&&(m={},e.set(u,m)),m}function i(u){e.delete(u)}function c(u,m,N){e.get(u)[m]=N}function s(){e=new WeakMap}return{has:n,get:t,remove:i,update:c,dispose:s}}function zf(e,n){return e.groupOrder!==n.groupOrder?e.groupOrder-n.groupOrder:e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.material.id!==n.material.id?e.material.id-n.material.id:e.materialVariant!==n.materialVariant?e.materialVariant-n.materialVariant:e.z!==n.z?e.z-n.z:e.id-n.id}function ao(e,n){return e.groupOrder!==n.groupOrder?e.groupOrder-n.groupOrder:e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.z!==n.z?n.z-e.z:e.id-n.id}function oo(){let e=[],n=0,t=[],i=[],c=[];function s(){n=0,t.length=0,i.length=0,c.length=0}function u(M){let E=0;return M.isInstancedMesh&&(E+=2),M.isSkinnedMesh&&(E+=1),E}function m(M,E,L,O,f,l){let g=e[n];return g===void 0?(g={id:M.id,object:M,geometry:E,material:L,materialVariant:u(M),groupOrder:O,renderOrder:M.renderOrder,z:f,group:l},e[n]=g):(g.id=M.id,g.object=M,g.geometry=E,g.material=L,g.materialVariant=u(M),g.groupOrder=O,g.renderOrder=M.renderOrder,g.z=f,g.group=l),n++,g}function N(M,E,L,O,f,l,g){g.reversedDepth===!0&&(f=-f);let D=m(M,E,L,O,f,l);L.transmission>0?i.push(D):L.transparent===!0?c.push(D):t.push(D)}function R(M,E,L,O,f,l){let g=m(M,E,L,O,f,l);L.transmission>0?i.unshift(g):L.transparent===!0?c.unshift(g):t.unshift(g)}function z(M,E){t.length>1&&t.sort(M||zf),i.length>1&&i.sort(E||ao),c.length>1&&c.sort(E||ao)}function y(){for(let M=n,E=e.length;M<E;M++){let L=e[M];if(L.id===null)break;L.id=null,L.object=null,L.geometry=null,L.material=null,L.group=null}}return{opaque:t,transmissive:i,transparent:c,init:s,push:N,unshift:R,finish:y,sort:z}}function Xf(){let e=new WeakMap;function n(i,c){let s=e.get(i),u;return s===void 0?(u=new oo,e.set(i,[u])):c>=s.length?(u=new oo,s.push(u)):u=s[c],u}function t(){e=new WeakMap}return{get:n,dispose:t}}function Kf(){let e={};return{get:function(n){if(e[n.id]!==void 0)return e[n.id];let t;switch(n.type){case"SunLight":case"DirectionalLight":t={direction:new We,color:new Ze};break;case"SpotLight":t={position:new We,direction:new We,color:new Ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new We,color:new Ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new We,skyColor:new Ze,groundColor:new Ze};break;case"RectAreaLight":t={color:new Ze,position:new We,halfWidth:new We,halfHeight:new We};break}return e[n.id]=t,t}}}function qf(){let e={};return{get:function(n){if(e[n.id]!==void 0)return e[n.id];let t;switch(n.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[n.id]=t,t}}}var Yf=0;function Zf(e,n){return(n.castShadow?2:0)-(e.castShadow?2:0)+(n.map?1:0)-(e.map?1:0)}function $f(e){let n=new Kf,t=qf(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let R=0;R<9;R++)i.probe.push(new We);let c=new We,s=new Qt,u=new Qt;function m(R){let z=0,y=0,M=0;for(let X=0;X<9;X++)i.probe[X].set(0,0,0);let E=0,L=0,O=0,f=0,l=0,g=0,D=0,S=0,b=0,v=0,o=0,p=0,q=0,w=0;R.sort(Zf);for(let X=0,Z=R.length;X<Z;X++){let T=R[X],Q=T.color,Y=T.intensity,H=T.distance,fe=null;if(T.shadow&&T.shadow.map&&(T.shadow.map.texture.format===Zt?fe=T.shadow.map.texture:fe=T.shadow.map.depthTexture||T.shadow.map.texture),T.isAmbientLight)z+=Q.r*Y,y+=Q.g*Y,M+=Q.b*Y;else if(T.isLightProbe){for(let K=0;K<9;K++)i.probe[K].addScaledVector(T.sh.coefficients[K],Y);w++}else if(T.isSunLight){let K=n.get(T);if(K.color.copy(T.color).multiplyScalar(T.intensity),T.castShadow){let j=T.shadow,ie=t.get(T);ie.shadowIntensity=j.intensity,ie.shadowBias=j.bias,ie.shadowNormalBias=j.normalBias,ie.shadowRadius=j.radius,ie.shadowMapSize.copy(j.mapSize).multiply(j.getFrameExtents()),i.sunShadow[L]=ie,i.sunShadowMap[L]=fe;let Ae=j.getViewportCount();for(let Ne=0;Ne<Ae;Ne++)i.sunShadowMatrix[O+Ne]=j.getMatrix(Ne),i.sunShadowCascade[O+Ne]=j._cascadeData[Ne];O+=Ae,L++}i.sun[E]=K,E++}else if(T.isDirectionalLight){let K=n.get(T);if(K.color.copy(T.color).multiplyScalar(T.intensity),T.castShadow){let j=T.shadow,ie=t.get(T);ie.shadowIntensity=j.intensity,ie.shadowBias=j.bias,ie.shadowNormalBias=j.normalBias,ie.shadowRadius=j.radius,ie.shadowMapSize=j.mapSize,i.directionalShadow[f]=ie,i.directionalShadowMap[f]=fe,i.directionalShadowMatrix[f]=T.shadow.matrix,b++}i.directional[f]=K,f++}else if(T.isSpotLight){let K=n.get(T);K.position.setFromMatrixPosition(T.matrixWorld),K.color.copy(Q).multiplyScalar(Y),K.distance=H,K.coneCos=Math.cos(T.angle),K.penumbraCos=Math.cos(T.angle*(1-T.penumbra)),K.decay=T.decay,i.spot[g]=K;let j=T.shadow;if(T.map&&(i.spotLightMap[p]=T.map,p++,j.updateMatrices(T),T.castShadow&&q++),i.spotLightMatrix[g]=j.matrix,T.castShadow){let ie=t.get(T);ie.shadowIntensity=j.intensity,ie.shadowBias=j.bias,ie.shadowNormalBias=j.normalBias,ie.shadowRadius=j.radius,ie.shadowMapSize=j.mapSize,i.spotShadow[g]=ie,i.spotShadowMap[g]=fe,o++}g++}else if(T.isRectAreaLight){let K=n.get(T);K.color.copy(Q).multiplyScalar(Y),K.halfWidth.set(T.width*.5,0,0),K.halfHeight.set(0,T.height*.5,0),i.rectArea[D]=K,D++}else if(T.isPointLight){let K=n.get(T);if(K.color.copy(T.color).multiplyScalar(T.intensity),K.distance=T.distance,K.decay=T.decay,T.castShadow){let j=T.shadow,ie=t.get(T);ie.shadowIntensity=j.intensity,ie.shadowBias=j.bias,ie.shadowNormalBias=j.normalBias,ie.shadowRadius=j.radius,ie.shadowMapSize=j.mapSize,ie.shadowCameraNear=j.camera.near,ie.shadowCameraFar=j.camera.far,i.pointShadow[l]=ie,i.pointShadowMap[l]=fe,i.pointShadowMatrix[l]=T.shadow.matrix,v++}i.point[l]=K,l++}else if(T.isHemisphereLight){let K=n.get(T);K.skyColor.copy(T.color).multiplyScalar(Y),K.groundColor.copy(T.groundColor).multiplyScalar(Y),i.hemi[S]=K,S++}}D>0&&(e.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ue.LTC_FLOAT_1,i.rectAreaLTC2=ue.LTC_FLOAT_2):(i.rectAreaLTC1=ue.LTC_HALF_1,i.rectAreaLTC2=ue.LTC_HALF_2)),i.ambient[0]=z,i.ambient[1]=y,i.ambient[2]=M;let I=i.hash;(I.sunLength!==E||I.directionalLength!==f||I.pointLength!==l||I.spotLength!==g||I.rectAreaLength!==D||I.hemiLength!==S||I.numSunShadows!==L||I.numDirectionalShadows!==b||I.numPointShadows!==v||I.numSpotShadows!==o||I.numSpotMaps!==p||I.numLightProbes!==w)&&(i.sun.length=E,i.directional.length=f,i.spot.length=g,i.rectArea.length=D,i.point.length=l,i.hemi.length=S,i.sunShadow.length=L,i.sunShadowMap.length=L,i.sunShadowMatrix.length=O,i.sunShadowCascade.length=O,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.directionalShadowMatrix.length=b,i.pointShadow.length=v,i.pointShadowMap.length=v,i.pointShadowMatrix.length=v,i.spotShadow.length=o,i.spotShadowMap.length=o,i.spotLightMatrix.length=o+p-q,i.spotLightMap.length=p,i.numSpotLightShadowsWithMaps=q,i.numLightProbes=w,I.sunLength=E,I.directionalLength=f,I.pointLength=l,I.spotLength=g,I.rectAreaLength=D,I.hemiLength=S,I.numSunShadows=L,I.numDirectionalShadows=b,I.numPointShadows=v,I.numSpotShadows=o,I.numSpotMaps=p,I.numLightProbes=w,i.version=Yf++)}function N(R,z){let y=0,M=0,E=0,L=0,O=0,f=0,l=z.matrixWorldInverse;for(let g=0,D=R.length;g<D;g++){let S=R[g];if(S.isSunLight){let b=i.sun[y];b.direction.setFromMatrixPosition(S.matrixWorld),b.direction.transformDirection(l),y++}else if(S.isDirectionalLight){let b=i.directional[M];b.direction.setFromMatrixPosition(S.matrixWorld),c.setFromMatrixPosition(S.target.matrixWorld),b.direction.sub(c),b.direction.transformDirection(l),M++}else if(S.isSpotLight){let b=i.spot[L];b.position.setFromMatrixPosition(S.matrixWorld),b.position.applyMatrix4(l),b.direction.setFromMatrixPosition(S.matrixWorld),c.setFromMatrixPosition(S.target.matrixWorld),b.direction.sub(c),b.direction.transformDirection(l),L++}else if(S.isRectAreaLight){let b=i.rectArea[O];b.position.setFromMatrixPosition(S.matrixWorld),b.position.applyMatrix4(l),u.identity(),s.copy(S.matrixWorld),s.premultiply(l),u.extractRotation(s),b.halfWidth.set(S.width*.5,0,0),b.halfHeight.set(0,S.height*.5,0),b.halfWidth.applyMatrix4(u),b.halfHeight.applyMatrix4(u),O++}else if(S.isPointLight){let b=i.point[E];b.position.setFromMatrixPosition(S.matrixWorld),b.position.applyMatrix4(l),E++}else if(S.isHemisphereLight){let b=i.hemi[f];b.direction.setFromMatrixPosition(S.matrixWorld),b.direction.transformDirection(l),f++}}}return{setup:m,setupView:N,state:i}}function so(e){let n=new $f(e),t=[],i=[],c=[];function s(y){z.camera=y,t.length=0,i.length=0,c.length=0}function u(y){y.isLightProbeGrid?c.push(y):t.push(y)}function m(y){i.push(y)}function N(){n.setup(t),c.sort((y,M)=>y.priority-M.priority||y.id-M.id)}function R(y){n.setupView(t,y)}let z={lightsArray:t,shadowsArray:i,lightProbeGridArray:c,camera:null,lights:n,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:z,setupLights:N,setupLightsView:R,pushLight:u,pushShadow:m}}function Qf(e){let n=new WeakMap;function t(c,s=0){let u=n.get(c),m;return u===void 0?(m=new so(e),n.set(c,[m])):s>=u.length?(m=new so(e),u.push(m)):m=u[s],m}function i(){n=new WeakMap}return{get:t,dispose:i}}var Jf=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,jf=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,ed=[new We(1,0,0),new We(-1,0,0),new We(0,1,0),new We(0,-1,0),new We(0,0,1),new We(0,0,-1)],td=[new We(0,-1,0),new We(0,-1,0),new We(0,0,1),new We(0,0,-1),new We(0,-1,0),new We(0,-1,0)],lo=new Qt,hn=new We,nr=new We;function nd(e,n,t){let i=new Yi,c=new ht,s=new ht,u=new mt,m=new Ba,N=new Ga,R={},z=t.maxTextureSize,y={[en]:St,[St]:en,[Lt]:Lt},M=new Jt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:Jf,fragmentShader:jf}),E=M.clone();E.defines.HORIZONTAL_PASS=1;let L=new qi;L.setAttribute("position",new Da(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let O=new kt(L,M),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=cn;let l=this.type;this.render=function(v,o,p){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||v.length===0)return;this.type===Rr&&(He("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=cn);let q=e.getRenderTarget(),w=e.getActiveCubeFace(),I=e.getActiveMipmapLevel(),X=e.state;X.setBlending(qt),X.buffers.depth.getReversed()===!0?X.buffers.color.setClear(0,0,0,0):X.buffers.color.setClear(1,1,1,1),X.buffers.depth.setTest(!0),X.setScissorTest(!1);let Z=l!==this.type;Z&&o.traverse(function(T){T.material&&(Array.isArray(T.material)?T.material.forEach(Q=>Q.needsUpdate=!0):T.material.needsUpdate=!0)});for(let T=0,Q=v.length;T<Q;T++){let Y=v[T],H=Y.shadow;if(H===void 0){He("WebGLShadowMap:",Y,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;c.copy(H.mapSize);let fe=H.getFrameExtents();c.multiply(fe),s.copy(H.mapSize),(c.x>z||c.y>z)&&(c.x>z&&(s.x=Math.floor(z/fe.x),c.x=s.x*fe.x,H.mapSize.x=s.x),c.y>z&&(s.y=Math.floor(z/fe.y),c.y=s.y*fe.y,H.mapSize.y=s.y));let K=e.state.buffers.depth.getReversed();if(H.camera._reversedDepth=K,H.map===null||Z===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===jt){if(Y.isPointLight){He("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new bt(c.x,c.y,{format:Zt,type:wt,minFilter:At,magFilter:At,generateMipmaps:!1}),H.map.texture.name=Y.name+".shadowMap",H.map.depthTexture=new an(c.x,c.y,yt),H.map.depthTexture.name=Y.name+".shadowMapDepth",H.map.depthTexture.format=rn,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Gt,H.map.depthTexture.magFilter=Gt}else Y.isPointLight?(H.map=new _n(c.x),H.map.depthTexture=new $i(c.x,Vt)):(H.map=new bt(c.x,c.y),H.map.depthTexture=new an(c.x,c.y,Vt)),H.map.depthTexture.name=Y.name+".shadowMap",H.map.depthTexture.format=rn,this.type===cn?(H.map.depthTexture.compareFunction=K?Hi:Gi,H.map.depthTexture.minFilter=At,H.map.depthTexture.magFilter=At):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Gt,H.map.depthTexture.magFilter=Gt);H.camera.updateProjectionMatrix()}H.map.isWebGLCubeRenderTarget!==!0&&(H.map.width!==c.x||H.map.height!==c.y)&&H.map.setSize(c.x,c.y);let j=H.map.isWebGLCubeRenderTarget?6:H.getViewportCount();Y.isPointLight!==!0&&H.updateMatrices(Y,p);let ie=(H.camera.layers.mask&4294967294)!==0?H.camera.layers:p.layers;for(let Ae=0;Ae<j;Ae++){let Ne=H.getCamera(Ae);if(Y.isPointLight){let W=H.camera,he=H.matrix,Se=Y.distance||W.far;Se!==W.far&&(W.far=Se,W.updateProjectionMatrix()),hn.setFromMatrixPosition(Y.matrixWorld),W.position.copy(hn),nr.copy(W.position),nr.add(ed[Ae]),W.up.copy(td[Ae]),W.lookAt(nr),W.updateMatrixWorld(),he.makeTranslation(-hn.x,-hn.y,-hn.z),lo.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),H._frustum.setFromProjectionMatrix(lo,W.coordinateSystem,W.reversedDepth)}if(H.map.isWebGLCubeRenderTarget)e.setRenderTarget(H.map,Ae),e.clear();else{Ae===0&&(e.setRenderTarget(H.map),e.clear());let W=H.getViewport(Ae);u.set(s.x*W.x,s.y*W.y,s.x*W.z,s.y*W.w),X.viewport(u)}i=H.getFrustum(Ae),S(o,p,Ne,Y,ie,this.type)}H.isPointLightShadow!==!0&&this.type===jt&&g(H,p),H.needsUpdate=!1}l=this.type,f.needsUpdate=!1,e.setRenderTarget(q,w,I)};function g(v,o){let p=n.update(O);M.defines.VSM_SAMPLES!==v.blurSamples&&(M.defines.VSM_SAMPLES=v.blurSamples,E.defines.VSM_SAMPLES=v.blurSamples,M.needsUpdate=!0,E.needsUpdate=!0),v.mapPass===null?v.mapPass=new bt(c.x,c.y,{format:Zt,type:wt}):(v.mapPass.width!==v.map.width||v.mapPass.height!==v.map.height)&&v.mapPass.setSize(v.map.width,v.map.height),M.uniforms.shadow_pass.value=v.map.depthTexture,M.uniforms.resolution.value.set(v.map.width,v.map.height),M.uniforms.radius.value=v.radius,e.setRenderTarget(v.mapPass),e.clear(),e.renderBufferDirect(o,null,p,M,O,null),E.uniforms.shadow_pass.value=v.mapPass.texture,E.uniforms.resolution.value.set(v.map.width,v.map.height),E.uniforms.radius.value=v.radius,e.setRenderTarget(v.map),e.clear(),e.renderBufferDirect(o,null,p,E,O,null)}function D(v,o,p,q){let w=null,I=p.isPointLight===!0?v.customDistanceMaterial:v.customDepthMaterial;if(I!==void 0)w=I;else if(w=p.isPointLight===!0?N:m,e.localClippingEnabled&&o.clipShadows===!0&&Array.isArray(o.clippingPlanes)&&o.clippingPlanes.length!==0||o.displacementMap&&o.displacementScale!==0||o.alphaMap&&o.alphaTest>0||o.map&&o.alphaTest>0||o.alphaToCoverage===!0){let X=w.uuid,Z=o.uuid,T=R[X];T===void 0&&(T={},R[X]=T);let Q=T[Z];Q===void 0&&(Q=w.clone(),T[Z]=Q,o.addEventListener("dispose",b)),w=Q}if(w.visible=o.visible,w.wireframe=o.wireframe,q===jt?w.side=o.shadowSide!==null?o.shadowSide:o.side:w.side=o.shadowSide!==null?o.shadowSide:y[o.side],w.alphaMap=o.alphaMap,w.alphaTest=o.alphaToCoverage===!0?.5:o.alphaTest,w.map=o.map,w.clipShadows=o.clipShadows,w.clippingPlanes=o.clippingPlanes,w.clipIntersection=o.clipIntersection,w.displacementMap=o.displacementMap,w.displacementScale=o.displacementScale,w.displacementBias=o.displacementBias,w.wireframeLinewidth=o.wireframeLinewidth,w.linewidth=o.linewidth,p.isPointLight===!0&&w.isMeshDistanceMaterial===!0){let X=e.properties.get(w);X.light=p}return w}function S(v,o,p,q,w,I){if(v.visible===!1)return;if(v.layers.test(w)&&(v.isMesh||v.isLine||v.isPoints)&&(v.castShadow||v.receiveShadow&&I===jt)&&(!v.frustumCulled||v.intersectsFrustum(i))){v.modelViewMatrix.multiplyMatrices(p.matrixWorldInverse,v.matrixWorld);let T=n.update(v),Q=v.material;if(Array.isArray(Q)){let Y=T.groups;for(let H=0,fe=Y.length;H<fe;H++){let K=Y[H],j=Q[K.materialIndex];if(j&&j.visible){let ie=D(v,j,q,I);v.onBeforeShadow(e,v,o,p,T,ie,K),e.renderBufferDirect(p,null,T,ie,v,K),v.onAfterShadow(e,v,o,p,T,ie,K)}}}else if(Q.visible){let Y=D(v,Q,q,I);v.onBeforeShadow(e,v,o,p,T,Y,null),e.renderBufferDirect(p,null,T,Y,v,null),v.onAfterShadow(e,v,o,p,T,Y,null)}}let Z=v.children;for(let T=0,Q=Z.length;T<Q;T++)S(Z[T],o,p,q,w,I)}function b(v){v.target.removeEventListener("dispose",b);for(let p in R){let q=R[p],w=v.target.uuid;w in q&&(q[w].dispose(),delete q[w])}}}function id(e,n){function t(){let h=!1,V=new mt,F=null,ae=new mt(0,0,0,0);return{setMask:function(ee){F!==ee&&!h&&(e.colorMask(ee,ee,ee,ee),F=ee)},setLocked:function(ee){h=ee},setClear:function(ee,ne,Me,De,J){J===!0&&(ee*=De,ne*=De,Me*=De),V.set(ee,ne,Me,De),ae.equals(V)===!1&&(e.clearColor(ee,ne,Me,De),ae.copy(V))},reset:function(){h=!1,F=null,ae.set(-1,0,0,0)}}}function i(){let h=!1,V=!1,F=null,ae=null,ee=null;return{setReversed:function(ne){if(V!==ne){let Me=n.get("EXT_clip_control");ne?Me.clipControlEXT(Me.LOWER_LEFT_EXT,Me.ZERO_TO_ONE_EXT):Me.clipControlEXT(Me.LOWER_LEFT_EXT,Me.NEGATIVE_ONE_TO_ONE_EXT),V=ne;let De=ee;ee=null,this.setClear(De)}},getReversed:function(){return V},setTest:function(ne){ne?me(e.DEPTH_TEST):Ue(e.DEPTH_TEST)},setMask:function(ne){F!==ne&&!h&&(e.depthMask(ne),F=ne)},setFunc:function(ne){if(V&&(ne=Ta[ne]),ae!==ne){switch(ne){case Kr:e.depthFunc(e.NEVER);break;case qr:e.depthFunc(e.ALWAYS);break;case Yr:e.depthFunc(e.LESS);break;case Kn:e.depthFunc(e.LEQUAL);break;case Zr:e.depthFunc(e.EQUAL);break;case $r:e.depthFunc(e.GEQUAL);break;case Qr:e.depthFunc(e.GREATER);break;case Jr:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}ae=ne}},setLocked:function(ne){h=ne},setClear:function(ne){ee!==ne&&(ee=ne,V&&(ne=1-ne),e.clearDepth(ne))},reset:function(){h=!1,F=null,ae=null,ee=null,V=!1}}}function c(){let h=!1,V=null,F=null,ae=null,ee=null,ne=null,Me=null,De=null,J=null;return{setTest:function(xe){h||(xe?me(e.STENCIL_TEST):Ue(e.STENCIL_TEST))},setMask:function(xe){V!==xe&&!h&&(e.stencilMask(xe),V=xe)},setFunc:function(xe,Le,de){(F!==xe||ae!==Le||ee!==de)&&(e.stencilFunc(xe,Le,de),F=xe,ae=Le,ee=de)},setOp:function(xe,Le,de){(ne!==xe||Me!==Le||De!==de)&&(e.stencilOp(xe,Le,de),ne=xe,Me=Le,De=de)},setLocked:function(xe){h=xe},setClear:function(xe){J!==xe&&(e.clearStencil(xe),J=xe)},reset:function(){h=!1,V=null,F=null,ae=null,ee=null,ne=null,Me=null,De=null,J=null}}}let s=new t,u=new i,m=new c,N={},R=new WeakMap,z={},y={},M={},E=new WeakMap,L=[],O=null,f=!1,l=null,g=null,D=null,S=null,b=null,v=null,o=null,p=new Ze(0,0,0),q=0,w=!1,I=null,X=null,Z=null,T=null,Q=null,Y=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),H=!1,fe=0,K=e.getParameter(e.VERSION);K.indexOf("WebGL")!==-1?(fe=parseFloat(/^WebGL (\d)/.exec(K)[1]),H=fe>=1):K.indexOf("OpenGL ES")!==-1&&(fe=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),H=fe>=2);let j=null,ie={},Ae=e.getParameter(e.SCISSOR_BOX),Ne=e.getParameter(e.VIEWPORT),W=new mt().fromArray(Ae),he=new mt().fromArray(Ne);function Se(h,V,F,ae){let ee=new Uint8Array(4),ne=e.createTexture();e.bindTexture(h,ne),e.texParameteri(h,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(h,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let Me=0;Me<F;Me++)h===e.TEXTURE_3D||h===e.TEXTURE_2D_ARRAY?e.texImage3D(V,0,e.RGBA,1,1,ae,0,e.RGBA,e.UNSIGNED_BYTE,ee):e.texImage2D(V+Me,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,ee);return ne}let Re={};Re[e.TEXTURE_2D]=Se(e.TEXTURE_2D,e.TEXTURE_2D,1),Re[e.TEXTURE_CUBE_MAP]=Se(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),Re[e.TEXTURE_2D_ARRAY]=Se(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),Re[e.TEXTURE_3D]=Se(e.TEXTURE_3D,e.TEXTURE_3D,1,1),s.setClear(0,0,0,1),u.setClear(1),m.setClear(0),me(e.DEPTH_TEST),u.setFunc(Kn),vt(!1),je(Wn),me(e.CULL_FACE),ct(qt);function me(h){z[h]!==!0&&(e.enable(h),z[h]=!0)}function Ue(h){z[h]!==!1&&(e.disable(h),z[h]=!1)}function gt(h,V){return M[h]!==V?(e.bindFramebuffer(h,V),M[h]=V,h===e.DRAW_FRAMEBUFFER&&(M[e.FRAMEBUFFER]=V),h===e.FRAMEBUFFER&&(M[e.DRAW_FRAMEBUFFER]=V),!0):!1}function Ce(h,V){let F=L,ae=!1;if(h){F=E.get(V),F===void 0&&(F=[],E.set(V,F));let ee=h.textures;if(F.length!==ee.length||F[0]!==e.COLOR_ATTACHMENT0){for(let ne=0,Me=ee.length;ne<Me;ne++)F[ne]=e.COLOR_ATTACHMENT0+ne;F.length=ee.length,ae=!0}}else F[0]!==e.BACK&&(F[0]=e.BACK,ae=!0);ae&&e.drawBuffers(F)}function qe(h){return O!==h?(e.useProgram(h),O=h,!0):!1}let ke={[tn]:e.FUNC_ADD,[br]:e.FUNC_SUBTRACT,[Pr]:e.FUNC_REVERSE_SUBTRACT};ke[Lr]=e.MIN,ke[Dr]=e.MAX;let Ie={[wr]:e.ZERO,[Ur]:e.ONE,[Nr]:e.SRC_COLOR,[yr]:e.SRC_ALPHA,[Vr]:e.SRC_ALPHA_SATURATE,[Gr]:e.DST_COLOR,[Or]:e.DST_ALPHA,[Ir]:e.ONE_MINUS_SRC_COLOR,[Fr]:e.ONE_MINUS_SRC_ALPHA,[Hr]:e.ONE_MINUS_DST_COLOR,[Br]:e.ONE_MINUS_DST_ALPHA,[Wr]:e.CONSTANT_COLOR,[kr]:e.ONE_MINUS_CONSTANT_COLOR,[zr]:e.CONSTANT_ALPHA,[Xr]:e.ONE_MINUS_CONSTANT_ALPHA};function ct(h,V,F,ae,ee,ne,Me,De,J,xe){if(h===qt){f===!0&&(Ue(e.BLEND),f=!1);return}if(f===!1&&(me(e.BLEND),f=!0),h!==Cr){if(h!==l||xe!==w){if((g!==tn||b!==tn)&&(e.blendEquation(e.FUNC_ADD),g=tn,b=tn),xe)switch(h){case fn:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case kn:e.blendFunc(e.ONE,e.ONE);break;case zn:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case Xn:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:Ye("WebGLState: Invalid blending: ",h);break}else switch(h){case fn:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case kn:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case zn:Ye("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Xn:Ye("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ye("WebGLState: Invalid blending: ",h);break}D=null,S=null,v=null,o=null,p.set(0,0,0),q=0,l=h,w=xe}return}ee=ee||V,ne=ne||F,Me=Me||ae,(V!==g||ee!==b)&&(e.blendEquationSeparate(ke[V],ke[ee]),g=V,b=ee),(F!==D||ae!==S||ne!==v||Me!==o)&&(e.blendFuncSeparate(Ie[F],Ie[ae],Ie[ne],Ie[Me]),D=F,S=ae,v=ne,o=Me),(De.equals(p)===!1||J!==q)&&(e.blendColor(De.r,De.g,De.b,J),p.copy(De),q=J),l=h,w=!1}function nt(h,V){h.side===Lt?Ue(e.CULL_FACE):me(e.CULL_FACE);let F=h.side===St;V&&(F=!F),vt(F),h.blending===fn&&h.transparent===!1?ct(qt):ct(h.blending,h.blendEquation,h.blendSrc,h.blendDst,h.blendEquationAlpha,h.blendSrcAlpha,h.blendDstAlpha,h.blendColor,h.blendAlpha,h.premultipliedAlpha),u.setFunc(h.depthFunc),u.setTest(h.depthTest),u.setMask(h.depthWrite),s.setMask(h.colorWrite);let ae=h.stencilWrite;m.setTest(ae),ae&&(m.setMask(h.stencilWriteMask),m.setFunc(h.stencilFunc,h.stencilRef,h.stencilFuncMask),m.setOp(h.stencilFail,h.stencilZFail,h.stencilZPass)),ot(h.polygonOffset,h.polygonOffsetFactor,h.polygonOffsetUnits),h.alphaToCoverage===!0?me(e.SAMPLE_ALPHA_TO_COVERAGE):Ue(e.SAMPLE_ALPHA_TO_COVERAGE)}function vt(h){I!==h&&(h?e.frontFace(e.CW):e.frontFace(e.CCW),I=h)}function je(h){h!==Tr?(me(e.CULL_FACE),h!==X&&(h===Wn?e.cullFace(e.BACK):h===Ar?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):Ue(e.CULL_FACE),X=h}function Pt(h){h!==Z&&(H&&e.lineWidth(h),Z=h)}function ot(h,V,F){h?(me(e.POLYGON_OFFSET_FILL),(T!==V||Q!==F)&&(T=V,Q=F,u.getReversed()&&(V=-V,F=-F),e.polygonOffset(V,F))):Ue(e.POLYGON_OFFSET_FILL)}function Et(h){h?me(e.SCISSOR_TEST):Ue(e.SCISSOR_TEST)}function Mt(h){h===void 0&&(h=e.TEXTURE0+Y-1),j!==h&&(e.activeTexture(h),j=h)}function xt(h,V,F){F===void 0&&(j===null?F=e.TEXTURE0+Y-1:F=j);let ae=ie[F];ae===void 0&&(ae={type:void 0,texture:void 0},ie[F]=ae),(ae.type!==h||ae.texture!==V)&&(j!==F&&(e.activeTexture(F),j=F),e.bindTexture(h,V||Re[h]),ae.type=h,ae.texture=V)}function x(){let h=ie[j];h!==void 0&&h.type!==void 0&&(e.bindTexture(h.type,null),h.type=void 0,h.texture=void 0)}function Tt(){try{e.compressedTexImage2D(...arguments)}catch(h){Ye("WebGLState:",h)}}function $e(){try{e.compressedTexImage3D(...arguments)}catch(h){Ye("WebGLState:",h)}}function Qe(){try{e.texSubImage2D(...arguments)}catch(h){Ye("WebGLState:",h)}}function ce(){try{e.texSubImage3D(...arguments)}catch(h){Ye("WebGLState:",h)}}function it(){try{e.compressedTexSubImage2D(...arguments)}catch(h){Ye("WebGLState:",h)}}function Te(){try{e.compressedTexSubImage3D(...arguments)}catch(h){Ye("WebGLState:",h)}}function be(){try{e.texStorage2D(...arguments)}catch(h){Ye("WebGLState:",h)}}function d(){try{e.texStorage3D(...arguments)}catch(h){Ye("WebGLState:",h)}}function r(){try{e.texImage2D(...arguments)}catch(h){Ye("WebGLState:",h)}}function C(){try{e.texImage3D(...arguments)}catch(h){Ye("WebGLState:",h)}}function $(h){return y[h]!==void 0?y[h]:e.getParameter(h)}function k(h,V){y[h]!==V&&(e.pixelStorei(h,V),y[h]=V)}function te(h){W.equals(h)===!1&&(e.scissor(h.x,h.y,h.z,h.w),W.copy(h))}function se(h){he.equals(h)===!1&&(e.viewport(h.x,h.y,h.z,h.w),he.copy(h))}function B(h,V){let F=R.get(V);F===void 0&&(F=new WeakMap,R.set(V,F));let ae=F.get(h);ae===void 0&&(ae=e.getUniformBlockIndex(V,h.name),e.uniformBlockBinding(V,ae,ae),F.set(h,ae))}function G(h,V,F){let ee=R.get(V).get(h);N[ee]!==F&&(e.bindBufferBase(e.UNIFORM_BUFFER,ee,F),N[ee]=F)}function re(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),u.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),z={},y={},j=null,ie={},M={},N={},E=new WeakMap,L=[],O=null,f=!1,l=null,g=null,D=null,S=null,b=null,v=null,o=null,p=new Ze(0,0,0),q=0,w=!1,I=null,X=null,Z=null,T=null,Q=null,W.set(0,0,e.canvas.width,e.canvas.height),he.set(0,0,e.canvas.width,e.canvas.height),s.reset(),u.reset(),m.reset()}return{buffers:{color:s,depth:u,stencil:m},enable:me,disable:Ue,bindFramebuffer:gt,drawBuffers:Ce,useProgram:qe,setBlending:ct,setMaterial:nt,setFlipSided:vt,setCullFace:je,setLineWidth:Pt,setPolygonOffset:ot,setScissorTest:Et,activeTexture:Mt,bindTexture:xt,unbindTexture:x,compressedTexImage2D:Tt,compressedTexImage3D:$e,texImage2D:r,texImage3D:C,pixelStorei:k,getParameter:$,updateUBOMapping:B,uniformBlockBinding:G,texStorage2D:be,texStorage3D:d,texSubImage2D:Qe,texSubImage3D:ce,compressedTexSubImage2D:it,compressedTexSubImage3D:Te,scissor:te,viewport:se,reset:re}}function rd(e,n,t,i,c,s,u){let m=n.has("WEBGL_multisampled_render_to_texture")?n.get("WEBGL_multisampled_render_to_texture"):null,N=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),R=new ht,z=new WeakMap,y=new Set,M,E=new WeakMap,L=new Set,O=new FinalizationRegistry(d=>L.delete(d)),f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function l(d,r){return f?new OffscreenCanvas(d,r):Sa("canvas")}function g(d,r,C){let $=1,k=be(d);if((k.width>C||k.height>C)&&($=C/Math.max(k.width,k.height)),$<1)if(typeof HTMLImageElement<"u"&&d instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&d instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&d instanceof ImageBitmap||typeof VideoFrame<"u"&&d instanceof VideoFrame){let te=Math.floor($*k.width),se=Math.floor($*k.height);M===void 0&&(M=l(te,se));let B=r?l(te,se):M;return B.width=te,B.height=se,B.getContext("2d").drawImage(d,0,0,te,se),He("WebGLRenderer: Texture has been resized from ("+k.width+"x"+k.height+") to ("+te+"x"+se+")."),B}else return"data"in d&&He("WebGLRenderer: Image in DataTexture is too big ("+k.width+"x"+k.height+")."),d;return d}function D(d){return d.generateMipmaps}function S(d){e.generateMipmap(d)}function b(d){return d.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:d.isWebGL3DRenderTarget?e.TEXTURE_3D:d.isWebGLArrayRenderTarget||d.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function v(d,r,C,$,k,te=!1){if(d!==null){if(e[d]!==void 0)return e[d];He("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+d+"'")}let se;$&&(se=n.get("EXT_texture_norm16"),se||He("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let B=r;if(r===e.RED&&(C===e.FLOAT&&(B=e.R32F),C===e.HALF_FLOAT&&(B=e.R16F),C===e.UNSIGNED_BYTE&&(B=e.R8),C===e.UNSIGNED_SHORT&&se&&(B=se.R16_EXT),C===e.SHORT&&se&&(B=se.R16_SNORM_EXT)),r===e.RED_INTEGER&&(C===e.UNSIGNED_BYTE&&(B=e.R8UI),C===e.UNSIGNED_SHORT&&(B=e.R16UI),C===e.UNSIGNED_INT&&(B=e.R32UI),C===e.BYTE&&(B=e.R8I),C===e.SHORT&&(B=e.R16I),C===e.INT&&(B=e.R32I)),r===e.RG&&(C===e.FLOAT&&(B=e.RG32F),C===e.HALF_FLOAT&&(B=e.RG16F),C===e.UNSIGNED_BYTE&&(B=e.RG8),C===e.UNSIGNED_SHORT&&se&&(B=se.RG16_EXT),C===e.SHORT&&se&&(B=se.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(C===e.UNSIGNED_BYTE&&(B=e.RG8UI),C===e.UNSIGNED_SHORT&&(B=e.RG16UI),C===e.UNSIGNED_INT&&(B=e.RG32UI),C===e.BYTE&&(B=e.RG8I),C===e.SHORT&&(B=e.RG16I),C===e.INT&&(B=e.RG32I)),r===e.RGB_INTEGER&&(C===e.UNSIGNED_BYTE&&(B=e.RGB8UI),C===e.UNSIGNED_SHORT&&(B=e.RGB16UI),C===e.UNSIGNED_INT&&(B=e.RGB32UI),C===e.BYTE&&(B=e.RGB8I),C===e.SHORT&&(B=e.RGB16I),C===e.INT&&(B=e.RGB32I)),r===e.RGBA_INTEGER&&(C===e.UNSIGNED_BYTE&&(B=e.RGBA8UI),C===e.UNSIGNED_SHORT&&(B=e.RGBA16UI),C===e.UNSIGNED_INT&&(B=e.RGBA32UI),C===e.BYTE&&(B=e.RGBA8I),C===e.SHORT&&(B=e.RGBA16I),C===e.INT&&(B=e.RGBA32I)),r===e.RGB&&(C===e.UNSIGNED_SHORT&&se&&(B=se.RGB16_EXT),C===e.SHORT&&se&&(B=se.RGB16_SNORM_EXT),C===e.UNSIGNED_INT_5_9_9_9_REV&&(B=e.RGB9_E5),C===e.UNSIGNED_INT_10F_11F_11F_REV&&(B=e.R11F_G11F_B10F)),r===e.RGBA){let G=te?Bi:Je.getTransfer(k);C===e.FLOAT&&(B=e.RGBA32F),C===e.HALF_FLOAT&&(B=e.RGBA16F),C===e.UNSIGNED_BYTE&&(B=G===Xe?e.SRGB8_ALPHA8:e.RGBA8),C===e.UNSIGNED_SHORT&&se&&(B=se.RGBA16_EXT),C===e.SHORT&&se&&(B=se.RGBA16_SNORM_EXT),C===e.UNSIGNED_SHORT_4_4_4_4&&(B=e.RGBA4),C===e.UNSIGNED_SHORT_5_5_5_1&&(B=e.RGB5_A1)}return(B===e.R16F||B===e.R32F||B===e.RG16F||B===e.RG32F||B===e.RGBA16F||B===e.RGBA32F)&&n.get("EXT_color_buffer_float"),B}function o(d,r){let C;return d?r===null||r===Vt||r===Yt?C=e.DEPTH24_STENCIL8:r===yt?C=e.DEPTH32F_STENCIL8:r===pn&&(C=e.DEPTH24_STENCIL8,He("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):r===null||r===Vt||r===Yt?C=e.DEPTH_COMPONENT24:r===yt?C=e.DEPTH_COMPONENT32F:r===pn&&(C=e.DEPTH_COMPONENT16),C}function p(d,r){return D(d)===!0||d.isFramebufferTexture&&d.minFilter!==Gt&&d.minFilter!==At?Math.log2(Math.max(r.width,r.height))+1:d.mipmaps.length>0?d.mipmaps.length:d.isCompressedTexture&&Array.isArray(d.image)?r.mipmaps.length:1}function q(d){let r=new WeakRef(d);i.get(d).__ref=r,L.add(r),O.register(d,r,r)}function w(d){let r=i.get(d).__ref;r!==void 0&&(L.delete(r),O.unregister(r))}function I(d){Z(d.target)}function X(d){T(d.target)}function Z(d){d.removeEventListener("dispose",I),w(d),Y(d),d.isVideoTexture&&z.delete(d),d.isHTMLTexture&&y.delete(d)}function T(d){d.removeEventListener("dispose",X),w(d),fe(d)}function Q(){for(let d of L){let r=d.deref();r!==void 0&&(r.isRenderTarget===!0?T(r):Z(r))}L.clear(),y.clear()}function Y(d){let r=i.get(d);if(r.__webglInit===void 0)return;let C=d.source,$=E.get(C);if($){let k=$[r.__cacheKey];k.usedTimes--,k.usedTimes===0&&H(d),Object.keys($).length===0&&E.delete(C)}i.remove(d)}function H(d){let r=i.get(d);e.deleteTexture(r.__webglTexture);let C=d.source,$=E.get(C);delete $[r.__cacheKey],u.memory.textures--}function fe(d){let r=i.get(d);r.__depthDisposeCallback&&r.__depthDisposeCallback();let C=d.depthTexture;if(C&&C.renderTarget===d&&Z(C),d.isWebGLCubeRenderTarget)for(let k=0;k<6;k++){if(Array.isArray(r.__webglFramebuffer[k]))for(let te=0;te<r.__webglFramebuffer[k].length;te++)e.deleteFramebuffer(r.__webglFramebuffer[k][te]);else e.deleteFramebuffer(r.__webglFramebuffer[k]);r.__webglDepthbuffer&&e.deleteRenderbuffer(r.__webglDepthbuffer[k])}else{if(Array.isArray(r.__webglFramebuffer))for(let k=0;k<r.__webglFramebuffer.length;k++)e.deleteFramebuffer(r.__webglFramebuffer[k]);else e.deleteFramebuffer(r.__webglFramebuffer);if(r.__webglDepthbuffer&&e.deleteRenderbuffer(r.__webglDepthbuffer),r.__webglMultisampledFramebuffer&&e.deleteFramebuffer(r.__webglMultisampledFramebuffer),r.__webglColorRenderbuffer)for(let k=0;k<r.__webglColorRenderbuffer.length;k++)r.__webglColorRenderbuffer[k]&&e.deleteRenderbuffer(r.__webglColorRenderbuffer[k]);r.__webglDepthRenderbuffer&&e.deleteRenderbuffer(r.__webglDepthRenderbuffer)}let $=d.textures;for(let k=0,te=$.length;k<te;k++){let se=i.get($[k]);se.__webglTexture&&(e.deleteTexture(se.__webglTexture),u.memory.textures--),i.remove($[k])}i.remove(d)}let K=0;function j(){K=0}function ie(){return K}function Ae(d){K=d}function Ne(){let d=K;return d>=c.maxTextures&&He("WebGLTextures: Trying to use "+(d+1)+" texture units while this GPU supports only "+c.maxTextures),K+=1,d}function W(d){let r=[];return r.push(d.wrapS),r.push(d.wrapT),r.push(d.wrapR||0),r.push(d.magFilter),r.push(d.minFilter),r.push(d.anisotropy),r.push(d.internalFormat),r.push(d.format),r.push(d.type),r.push(d.generateMipmaps),r.push(d.mipmapsAutoUpdate),r.push(d.premultiplyAlpha),r.push(d.flipY),r.push(d.unpackAlignment),r.push(d.colorSpace),r.join()}function he(d,r){let C=i.get(d);if(d.isVideoTexture&&it(d),d.isRenderTargetTexture===!1&&d.isExternalTexture!==!0&&d.version>0&&C.__version!==d.version){let $=d.image;if($===null)He("WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)He("WebGLRenderer: Texture marked for update but image is incomplete");else{nt(C,d,r);return}}else d.isExternalTexture&&(C.__webglTexture=d.sourceTexture?d.sourceTexture:null);t.bindTexture(e.TEXTURE_2D,C.__webglTexture,e.TEXTURE0+r)}function Se(d,r){let C=i.get(d);if(d.isRenderTargetTexture===!1&&d.version>0&&C.__version!==d.version){nt(C,d,r);return}else d.isExternalTexture&&(C.__webglTexture=d.sourceTexture?d.sourceTexture:null);t.bindTexture(e.TEXTURE_2D_ARRAY,C.__webglTexture,e.TEXTURE0+r)}function Re(d,r){let C=i.get(d);if(d.isRenderTargetTexture===!1&&d.version>0&&C.__version!==d.version){nt(C,d,r);return}t.bindTexture(e.TEXTURE_3D,C.__webglTexture,e.TEXTURE0+r)}function me(d,r){let C=i.get(d);if(d.version>0&&C.__version!==d.version){vt(C,d,r);return}t.bindTexture(e.TEXTURE_CUBE_MAP,C.__webglTexture,e.TEXTURE0+r)}let Ue={[na]:e.REPEAT,[xn]:e.CLAMP_TO_EDGE,[ia]:e.MIRRORED_REPEAT},gt={[Gt]:e.NEAREST,[ra]:e.NEAREST_MIPMAP_NEAREST,[un]:e.NEAREST_MIPMAP_LINEAR,[At]:e.LINEAR,[Tn]:e.LINEAR_MIPMAP_NEAREST,[Ht]:e.LINEAR_MIPMAP_LINEAR},Ce={[ha]:e.NEVER,[Vi]:e.ALWAYS,[ma]:e.LESS,[Gi]:e.LEQUAL,[_a]:e.EQUAL,[Hi]:e.GEQUAL,[ga]:e.GREATER,[va]:e.NOTEQUAL};function qe(d,r){if(r.type===yt&&n.has("OES_texture_float_linear")===!1&&(r.magFilter===At||r.magFilter===Tn||r.magFilter===un||r.magFilter===Ht||r.minFilter===At||r.minFilter===Tn||r.minFilter===un||r.minFilter===Ht)&&He("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(d,e.TEXTURE_WRAP_S,Ue[r.wrapS]),e.texParameteri(d,e.TEXTURE_WRAP_T,Ue[r.wrapT]),(d===e.TEXTURE_3D||d===e.TEXTURE_2D_ARRAY)&&e.texParameteri(d,e.TEXTURE_WRAP_R,Ue[r.wrapR]),e.texParameteri(d,e.TEXTURE_MAG_FILTER,gt[r.magFilter]),e.texParameteri(d,e.TEXTURE_MIN_FILTER,gt[r.minFilter]),r.compareFunction&&(e.texParameteri(d,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(d,e.TEXTURE_COMPARE_FUNC,Ce[r.compareFunction])),n.has("EXT_texture_filter_anisotropic")===!0){if(r.magFilter===Gt||r.minFilter!==un&&r.minFilter!==Ht||r.type===yt&&n.has("OES_texture_float_linear")===!1)return;if(r.anisotropy>1||i.get(r).__currentAnisotropy){let C=n.get("EXT_texture_filter_anisotropic");e.texParameterf(d,C.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(r.anisotropy,c.getMaxAnisotropy())),i.get(r).__currentAnisotropy=r.anisotropy}}}function ke(d,r){let C=!1;d.__webglInit===void 0&&(d.__webglInit=!0,r.addEventListener("dispose",I),q(r));let $=r.source,k=E.get($);k===void 0&&(k={},E.set($,k));let te=W(r);if(te!==d.__cacheKey){k[te]===void 0&&(k[te]={texture:e.createTexture(),usedTimes:0},u.memory.textures++,C=!0),k[te].usedTimes++;let se=k[d.__cacheKey];se!==void 0&&(k[d.__cacheKey].usedTimes--,se.usedTimes===0&&H(r)),d.__cacheKey=te,d.__webglTexture=k[te].texture}return C}function Ie(d,r,C){return Math.floor(Math.floor(d/C)/r)}function ct(d,r,C,$){let te=d.updateRanges;if(te.length===0)t.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,C,$,r.data);else{te.sort((h,V)=>h.start-V.start);let se=0;for(let h=1;h<te.length;h++){let V=te[se],F=te[h],ae=V.start+V.count,ee=Ie(F.start,r.width,4),ne=Ie(V.start,r.width,4);F.start<=ae+1&&ee===ne&&Ie(F.start+F.count-1,r.width,4)===ee?V.count=Math.max(V.count,F.start+F.count-V.start):(++se,te[se]=F)}te.length=se+1;let B=t.getParameter(e.UNPACK_ROW_LENGTH),G=t.getParameter(e.UNPACK_SKIP_PIXELS),re=t.getParameter(e.UNPACK_SKIP_ROWS);t.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let h=0,V=te.length;h<V;h++){let F=te[h],ae=Math.floor(F.start/4),ee=Math.ceil(F.count/4),ne=ae%r.width,Me=Math.floor(ae/r.width),De=ee,J=1;t.pixelStorei(e.UNPACK_SKIP_PIXELS,ne),t.pixelStorei(e.UNPACK_SKIP_ROWS,Me),t.texSubImage2D(e.TEXTURE_2D,0,ne,Me,De,J,C,$,r.data)}d.clearUpdateRanges(),t.pixelStorei(e.UNPACK_ROW_LENGTH,B),t.pixelStorei(e.UNPACK_SKIP_PIXELS,G),t.pixelStorei(e.UNPACK_SKIP_ROWS,re)}}function nt(d,r,C){let $=e.TEXTURE_2D;(r.isDataArrayTexture||r.isCompressedArrayTexture)&&($=e.TEXTURE_2D_ARRAY),r.isData3DTexture&&($=e.TEXTURE_3D);let k=ke(d,r),te=r.source;t.bindTexture($,d.__webglTexture,e.TEXTURE0+C);let se=i.get(te);if(te.version!==se.__version||k===!0){if(t.activeTexture(e.TEXTURE0+C),(typeof ImageBitmap<"u"&&r.image instanceof ImageBitmap)===!1){let J=Je.getPrimaries(Je.workingColorSpace),xe=r.colorSpace===$t?null:Je.getPrimaries(r.colorSpace),Le=r.colorSpace===$t||J===xe?e.NONE:e.BROWSER_DEFAULT_WEBGL;t.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,r.flipY),t.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,r.premultiplyAlpha),t.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,Le)}t.pixelStorei(e.UNPACK_ALIGNMENT,r.unpackAlignment);let G=g(r.image,!1,c.maxTextureSize);G=Te(r,G);let re=s.convert(r.format,r.colorSpace),h=s.convert(r.type),V=v(r.internalFormat,re,h,r.normalized,r.colorSpace,r.isVideoTexture);qe($,r);let F,ae=r.mipmaps,ee=r.isVideoTexture!==!0,ne=se.__version===void 0||k===!0,Me=te.dataReady,De=p(r,G);if(r.isDepthTexture)V=o(r.format===Wt,r.type),ne&&(ee?t.texStorage2D(e.TEXTURE_2D,1,V,G.width,G.height):t.texImage2D(e.TEXTURE_2D,0,V,G.width,G.height,0,re,h,null));else if(r.isDataTexture)if(ae.length>0){ee&&ne&&t.texStorage2D(e.TEXTURE_2D,De,V,ae[0].width,ae[0].height);for(let J=0,xe=ae.length;J<xe;J++)F=ae[J],ee?Me&&t.texSubImage2D(e.TEXTURE_2D,J,0,0,F.width,F.height,re,h,F.data):t.texImage2D(e.TEXTURE_2D,J,V,F.width,F.height,0,re,h,F.data);r.generateMipmaps=!1}else ee?(ne&&t.texStorage2D(e.TEXTURE_2D,De,V,G.width,G.height),Me&&ct(r,G,re,h)):t.texImage2D(e.TEXTURE_2D,0,V,G.width,G.height,0,re,h,G.data);else if(r.isCompressedTexture)if(r.isCompressedArrayTexture){ee&&ne&&t.texStorage3D(e.TEXTURE_2D_ARRAY,De,V,ae[0].width,ae[0].height,G.depth);for(let J=0,xe=ae.length;J<xe;J++)if(F=ae[J],r.format!==Ft)if(re!==null)if(ee){if(Me)if(r.layerUpdates.size>0){let Le=er(F.width,F.height,r.format,r.type);for(let de of r.layerUpdates){let Ve=F.data.subarray(de*Le/F.data.BYTES_PER_ELEMENT,(de+1)*Le/F.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,J,0,0,de,F.width,F.height,1,re,Ve)}}else t.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,J,0,0,0,F.width,F.height,G.depth,re,F.data)}else t.compressedTexImage3D(e.TEXTURE_2D_ARRAY,J,V,F.width,F.height,G.depth,0,F.data,0,0);else He("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ee?Me&&t.texSubImage3D(e.TEXTURE_2D_ARRAY,J,0,0,0,F.width,F.height,G.depth,re,h,F.data):t.texImage3D(e.TEXTURE_2D_ARRAY,J,V,F.width,F.height,G.depth,0,re,h,F.data);r.layerUpdates.size>0&&r.clearLayerUpdates()}else{ee&&ne&&t.texStorage2D(e.TEXTURE_2D,De,V,ae[0].width,ae[0].height);for(let J=0,xe=ae.length;J<xe;J++)F=ae[J],r.format!==Ft?re!==null?ee?Me&&t.compressedTexSubImage2D(e.TEXTURE_2D,J,0,0,F.width,F.height,re,F.data):t.compressedTexImage2D(e.TEXTURE_2D,J,V,F.width,F.height,0,F.data):He("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ee?Me&&t.texSubImage2D(e.TEXTURE_2D,J,0,0,F.width,F.height,re,h,F.data):t.texImage2D(e.TEXTURE_2D,J,V,F.width,F.height,0,re,h,F.data)}else if(r.isDataArrayTexture)if(ee){if(ne&&t.texStorage3D(e.TEXTURE_2D_ARRAY,De,V,G.width,G.height,G.depth),Me)if(r.layerUpdates.size>0){let J=er(G.width,G.height,r.format,r.type);for(let xe of r.layerUpdates){let Le=G.data.subarray(xe*J/G.data.BYTES_PER_ELEMENT,(xe+1)*J/G.data.BYTES_PER_ELEMENT);t.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,xe,G.width,G.height,1,re,h,Le)}r.clearLayerUpdates()}else t.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,G.width,G.height,G.depth,re,h,G.data)}else t.texImage3D(e.TEXTURE_2D_ARRAY,0,V,G.width,G.height,G.depth,0,re,h,G.data);else if(r.isData3DTexture)ee?(ne&&t.texStorage3D(e.TEXTURE_3D,De,V,G.width,G.height,G.depth),Me&&t.texSubImage3D(e.TEXTURE_3D,0,0,0,0,G.width,G.height,G.depth,re,h,G.data)):t.texImage3D(e.TEXTURE_3D,0,V,G.width,G.height,G.depth,0,re,h,G.data);else if(r.isFramebufferTexture){if(ne)if(ee)t.texStorage2D(e.TEXTURE_2D,De,V,G.width,G.height);else{let J=G.width,xe=G.height;for(let Le=0;Le<De;Le++)t.texImage2D(e.TEXTURE_2D,Le,V,J,xe,0,re,h,null),J>>=1,xe>>=1}}else if(r.isHTMLTexture){if("texElementImage2D"in e){let J=e.canvas;if(J.hasAttribute("layoutsubtree")||J.setAttribute("layoutsubtree","true"),G.parentNode!==J){J.appendChild(G),y.add(r),J.onpaint=xe=>{let Le=xe.changedElements;for(let de of y)Le.includes(de.image)&&(de.needsUpdate=!0)},J.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,G);else{let Le=e.RGBA,de=e.RGBA,Ve=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,Le,de,Ve,G)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(ae.length>0){if(ee&&ne){let J=be(ae[0]);t.texStorage2D(e.TEXTURE_2D,De,V,J.width,J.height)}for(let J=0,xe=ae.length;J<xe;J++)F=ae[J],ee?Me&&t.texSubImage2D(e.TEXTURE_2D,J,0,0,re,h,F):t.texImage2D(e.TEXTURE_2D,J,V,re,h,F);r.generateMipmaps=!1}else if(ee){if(ne){let J=be(G);t.texStorage2D(e.TEXTURE_2D,De,V,J.width,J.height)}Me&&t.texSubImage2D(e.TEXTURE_2D,0,0,0,re,h,G)}else t.texImage2D(e.TEXTURE_2D,0,V,re,h,G);D(r)&&r.mipmapsAutoUpdate===!0&&S($),se.__version=te.version,r.onUpdate&&r.onUpdate(r)}d.__version=r.version}function vt(d,r,C){if(r.image.length!==6)return;let $=ke(d,r),k=r.source;t.bindTexture(e.TEXTURE_CUBE_MAP,d.__webglTexture,e.TEXTURE0+C);let te=i.get(k);if(k.version!==te.__version||$===!0){t.activeTexture(e.TEXTURE0+C);let se=Je.getPrimaries(Je.workingColorSpace),B=r.colorSpace===$t?null:Je.getPrimaries(r.colorSpace),G=r.colorSpace===$t||se===B?e.NONE:e.BROWSER_DEFAULT_WEBGL;t.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,r.flipY),t.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,r.premultiplyAlpha),t.pixelStorei(e.UNPACK_ALIGNMENT,r.unpackAlignment),t.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,G);let re=r.isCompressedTexture||r.image[0].isCompressedTexture,h=r.image[0]&&r.image[0].isDataTexture,V=[];for(let de=0;de<6;de++)!re&&!h?V[de]=g(r.image[de],!0,c.maxCubemapSize):V[de]=h?r.image[de].image:r.image[de],V[de]=Te(r,V[de]);let F=V[0],ae=s.convert(r.format,r.colorSpace),ee=s.convert(r.type),ne=v(r.internalFormat,ae,ee,r.normalized,r.colorSpace),Me=r.isVideoTexture!==!0,De=te.__version===void 0||$===!0,J=k.dataReady,xe=p(r,F);qe(e.TEXTURE_CUBE_MAP,r);let Le;if(r.isDepthTexture){if(ne=o(r.format===Wt,r.type),De)if(Me)t.texStorage2D(e.TEXTURE_CUBE_MAP,1,ne,F.width,F.height);else for(let de=0;de<6;de++)t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,0,ne,F.width,F.height,0,ae,ee,null)}else if(re){Me&&De&&t.texStorage2D(e.TEXTURE_CUBE_MAP,xe,ne,F.width,F.height);for(let de=0;de<6;de++){Le=V[de].mipmaps;for(let Ve=0;Ve<Le.length;Ve++){let st=Le[Ve];r.format!==Ft?ae!==null?Me?J&&t.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,Ve,0,0,st.width,st.height,ae,st.data):t.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,Ve,ne,st.width,st.height,0,st.data):He("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Me?J&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,Ve,0,0,st.width,st.height,ae,ee,st.data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,Ve,ne,st.width,st.height,0,ae,ee,st.data)}}}else{if(Le=r.mipmaps,Me&&De){Le.length>0&&xe++;let de=be(V[0]);t.texStorage2D(e.TEXTURE_CUBE_MAP,xe,ne,de.width,de.height)}for(let de=0;de<6;de++)if(h){Me?J&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,0,0,0,V[de].width,V[de].height,ae,ee,V[de].data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,0,ne,V[de].width,V[de].height,0,ae,ee,V[de].data);for(let Ve=0;Ve<Le.length;Ve++){let Ot=Le[Ve].image[de].image;Me?J&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,Ve+1,0,0,Ot.width,Ot.height,ae,ee,Ot.data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,Ve+1,ne,Ot.width,Ot.height,0,ae,ee,Ot.data)}}else{Me?J&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,0,0,0,ae,ee,V[de]):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,0,ne,ae,ee,V[de]);for(let Ve=0;Ve<Le.length;Ve++){let st=Le[Ve];Me?J&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,Ve+1,0,0,ae,ee,st.image[de]):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+de,Ve+1,ne,ae,ee,st.image[de])}}}D(r)&&r.mipmapsAutoUpdate===!0&&S(e.TEXTURE_CUBE_MAP),te.__version=k.version,r.onUpdate&&r.onUpdate(r)}d.__version=r.version}function je(d,r,C,$,k,te){let se=s.convert(C.format,C.colorSpace),B=s.convert(C.type),G=v(C.internalFormat,se,B,C.normalized,C.colorSpace),re=i.get(r),h=i.get(C);if(h.__renderTarget=r,!re.__hasExternalTextures){let V=Math.max(1,r.width>>te),F=Math.max(1,r.height>>te);k===e.TEXTURE_3D||k===e.TEXTURE_2D_ARRAY?t.texImage3D(k,te,G,V,F,r.depth,0,se,B,null):t.texImage2D(k,te,G,V,F,0,se,B,null)}t.bindFramebuffer(e.FRAMEBUFFER,d),ce(r)?m.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,$,k,h.__webglTexture,0,Qe(r)):(k===e.TEXTURE_2D||k>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&k<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,$,k,h.__webglTexture,te),t.bindFramebuffer(e.FRAMEBUFFER,null)}function Pt(d,r,C){if(e.bindRenderbuffer(e.RENDERBUFFER,d),r.depthBuffer){let $=r.depthTexture,k=$&&$.isDepthTexture?$.type:null,te=o(r.stencilBuffer,k),se=r.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;ce(r)?m.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Qe(r),te,r.width,r.height):C?e.renderbufferStorageMultisample(e.RENDERBUFFER,Qe(r),te,r.width,r.height):e.renderbufferStorage(e.RENDERBUFFER,te,r.width,r.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,se,e.RENDERBUFFER,d)}else{let $=r.textures;for(let k=0;k<$.length;k++){let te=$[k],se=s.convert(te.format,te.colorSpace),B=s.convert(te.type),G=v(te.internalFormat,se,B,te.normalized,te.colorSpace);ce(r)?m.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Qe(r),G,r.width,r.height):C?e.renderbufferStorageMultisample(e.RENDERBUFFER,Qe(r),G,r.width,r.height):e.renderbufferStorage(e.RENDERBUFFER,G,r.width,r.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function ot(d,r,C){let $=r.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(e.FRAMEBUFFER,d),!(r.depthTexture&&r.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let k=i.get(r.depthTexture);k.__renderTarget=r;let te=$?r.depthTexture.image[0]:r.depthTexture.image;(!k.__webglTexture||te.width!==r.width||te.height!==r.height)&&(te.width=r.width,te.height=r.height,r.depthTexture.needsUpdate=!0),$?me(r.depthTexture,0):he(r.depthTexture,0);let se=k.__webglTexture,B=Qe(r),G=$?e.TEXTURE_CUBE_MAP_POSITIVE_X+C:e.TEXTURE_2D,re=r.depthTexture.format===Wt?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(r.depthTexture.format===rn)ce(r)?m.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,re,G,se,0,B):e.framebufferTexture2D(e.FRAMEBUFFER,re,G,se,0);else if(r.depthTexture.format===Wt)ce(r)?m.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,re,G,se,0,B):e.framebufferTexture2D(e.FRAMEBUFFER,re,G,se,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Et(d){let r=i.get(d),C=d.isWebGLCubeRenderTarget===!0;if(r.__boundDepthTexture!==d.depthTexture){let $=d.depthTexture;if(r.__depthDisposeCallback&&r.__depthDisposeCallback(),$){let k=()=>{delete r.__boundDepthTexture,delete r.__depthDisposeCallback,$.removeEventListener("dispose",k)};$.addEventListener("dispose",k),r.__depthDisposeCallback=k}r.__boundDepthTexture=$}if(d.depthTexture&&!r.__autoAllocateDepthBuffer)if(C)for(let $=0;$<6;$++)ot(r.__webglFramebuffer[$],d,$);else d.texture.mipmaps.length>0?ot(r.__webglFramebuffer[0],d,0):ot(r.__webglFramebuffer,d,0);else if(C){r.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(t.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer[$]),r.__webglDepthbuffer[$]===void 0)r.__webglDepthbuffer[$]=e.createRenderbuffer(),Pt(r.__webglDepthbuffer[$],d,!1);else{let k=d.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,te=r.__webglDepthbuffer[$];e.bindRenderbuffer(e.RENDERBUFFER,te),e.framebufferRenderbuffer(e.FRAMEBUFFER,k,e.RENDERBUFFER,te)}}else if(d.texture.mipmaps.length>0?t.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer[0]):t.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer),r.__webglDepthbuffer===void 0)r.__webglDepthbuffer=e.createRenderbuffer(),Pt(r.__webglDepthbuffer,d,!1);else{let k=d.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,te=r.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,te),e.framebufferRenderbuffer(e.FRAMEBUFFER,k,e.RENDERBUFFER,te)}t.bindFramebuffer(e.FRAMEBUFFER,null)}function Mt(d,r,C){let $=i.get(d);r!==void 0&&je($.__webglFramebuffer,d,d.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),C!==void 0&&Et(d)}function xt(d){let r=d.texture,C=i.get(d),$=i.get(r);d.addEventListener("dispose",X),q(d);let k=d.textures,te=d.isWebGLCubeRenderTarget===!0,se=k.length>1;if(se||($.__webglTexture===void 0&&($.__webglTexture=e.createTexture()),$.__version=r.version,u.memory.textures++),te){C.__webglFramebuffer=[];for(let B=0;B<6;B++)if(r.mipmaps.length>0){C.__webglFramebuffer[B]=[];for(let G=0;G<r.mipmaps.length;G++)C.__webglFramebuffer[B][G]=e.createFramebuffer()}else C.__webglFramebuffer[B]=e.createFramebuffer()}else{if(r.mipmaps.length>0){C.__webglFramebuffer=[];for(let B=0;B<r.mipmaps.length;B++)C.__webglFramebuffer[B]=e.createFramebuffer()}else C.__webglFramebuffer=e.createFramebuffer();if(se)for(let B=0,G=k.length;B<G;B++){let re=i.get(k[B]);re.__webglTexture===void 0&&(re.__webglTexture=e.createTexture(),u.memory.textures++)}if(d.samples>0&&ce(d)===!1){C.__webglMultisampledFramebuffer=e.createFramebuffer(),C.__webglColorRenderbuffer=[],t.bindFramebuffer(e.FRAMEBUFFER,C.__webglMultisampledFramebuffer);for(let B=0;B<k.length;B++){let G=k[B];C.__webglColorRenderbuffer[B]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,C.__webglColorRenderbuffer[B]);let re=s.convert(G.format,G.colorSpace),h=s.convert(G.type),V=v(G.internalFormat,re,h,G.normalized,G.colorSpace,d.isXRRenderTarget===!0),F=Qe(d);e.renderbufferStorageMultisample(e.RENDERBUFFER,F,V,d.width,d.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+B,e.RENDERBUFFER,C.__webglColorRenderbuffer[B])}e.bindRenderbuffer(e.RENDERBUFFER,null),d.depthBuffer&&(C.__webglDepthRenderbuffer=e.createRenderbuffer(),Pt(C.__webglDepthRenderbuffer,d,!0)),t.bindFramebuffer(e.FRAMEBUFFER,null)}}if(te){t.bindTexture(e.TEXTURE_CUBE_MAP,$.__webglTexture),qe(e.TEXTURE_CUBE_MAP,r);for(let B=0;B<6;B++)if(r.mipmaps.length>0)for(let G=0;G<r.mipmaps.length;G++)je(C.__webglFramebuffer[B][G],d,r,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+B,G);else je(C.__webglFramebuffer[B],d,r,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+B,0);D(r)?S(e.TEXTURE_CUBE_MAP):r.mipmaps.length>0&&e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAX_LEVEL,r.mipmaps.length-1),t.unbindTexture()}else if(se){for(let B=0,G=k.length;B<G;B++){let re=k[B],h=i.get(re),V=e.TEXTURE_2D;(d.isWebGL3DRenderTarget||d.isWebGLArrayRenderTarget)&&(V=d.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),t.bindTexture(V,h.__webglTexture),qe(V,re),je(C.__webglFramebuffer,d,re,e.COLOR_ATTACHMENT0+B,V,0),D(re)&&S(V)}t.unbindTexture()}else{let B=e.TEXTURE_2D;if((d.isWebGL3DRenderTarget||d.isWebGLArrayRenderTarget)&&(B=d.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),t.bindTexture(B,$.__webglTexture),qe(B,r),r.mipmaps.length>0)for(let G=0;G<r.mipmaps.length;G++)je(C.__webglFramebuffer[G],d,r,e.COLOR_ATTACHMENT0,B,G);else je(C.__webglFramebuffer,d,r,e.COLOR_ATTACHMENT0,B,0);D(r)?S(B):r.mipmaps.length>0&&e.texParameteri(B,e.TEXTURE_MAX_LEVEL,r.mipmaps.length-1),t.unbindTexture()}d.depthBuffer&&Et(d)}function x(d){let r=d.textures;for(let C=0,$=r.length;C<$;C++){let k=r[C];if(D(k)&&k.mipmapsAutoUpdate===!0){let te=b(d),se=i.get(k).__webglTexture;t.bindTexture(te,se),S(te),t.unbindTexture()}}}let Tt=[];function $e(d){if(d.samples>0){if(ce(d)===!1){let r=d.textures,C=d.width,$=d.height,k=e.COLOR_BUFFER_BIT,te=d.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,se=i.get(d),B=r.length>1;if(B)for(let re=0;re<r.length;re++)t.bindFramebuffer(e.FRAMEBUFFER,se.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+re,e.RENDERBUFFER,null),t.bindFramebuffer(e.FRAMEBUFFER,se.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+re,e.TEXTURE_2D,null,0);t.bindFramebuffer(e.READ_FRAMEBUFFER,se.__webglMultisampledFramebuffer),d.texture.mipmaps.length>0?t.bindFramebuffer(e.DRAW_FRAMEBUFFER,se.__webglFramebuffer[0]):t.bindFramebuffer(e.DRAW_FRAMEBUFFER,se.__webglFramebuffer);for(let re=0;re<r.length;re++){if(d.resolveDepthBuffer&&(d.depthBuffer&&(k|=e.DEPTH_BUFFER_BIT),d.stencilBuffer&&d.resolveStencilBuffer&&(k|=e.STENCIL_BUFFER_BIT)),B){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,se.__webglColorRenderbuffer[re]);let h=i.get(r[re]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,h,0)}e.blitFramebuffer(0,0,C,$,0,0,C,$,k,e.NEAREST),N===!0&&(Tt.length=0,Tt.push(e.COLOR_ATTACHMENT0+re),d.depthBuffer&&d.storeMultisampledDepthBuffer===!1&&Tt.push(te),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Tt))}if(t.bindFramebuffer(e.READ_FRAMEBUFFER,null),t.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),B)for(let re=0;re<r.length;re++){t.bindFramebuffer(e.FRAMEBUFFER,se.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+re,e.RENDERBUFFER,se.__webglColorRenderbuffer[re]);let h=i.get(r[re]).__webglTexture;t.bindFramebuffer(e.FRAMEBUFFER,se.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+re,e.TEXTURE_2D,h,0)}t.bindFramebuffer(e.DRAW_FRAMEBUFFER,se.__webglMultisampledFramebuffer)}else if(d.depthBuffer&&d.storeMultisampledDepthBuffer===!1&&N){let r=d.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[r])}}}function Qe(d){return Math.min(c.maxSamples,d.samples)}function ce(d){let r=i.get(d);return d.samples>0&&n.has("WEBGL_multisampled_render_to_texture")===!0&&r.__useRenderToTexture!==!1}function it(d){let r=u.render.frame;z.get(d)!==r&&(z.set(d,r),d.update())}function Te(d,r){let C=d.colorSpace,$=d.format,k=d.type;return d.isCompressedTexture===!0||d.isVideoTexture===!0||C!==Oi&&C!==$t&&(Je.getTransfer(C)===Xe?($!==Ft||k!==Ct)&&He("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ye("WebGLTextures: Unsupported texture color space:",C)),r}function be(d){return typeof HTMLImageElement<"u"&&d instanceof HTMLImageElement?(R.width=d.naturalWidth||d.width,R.height=d.naturalHeight||d.height):typeof VideoFrame<"u"&&d instanceof VideoFrame?(R.width=d.displayWidth,R.height=d.displayHeight):(R.width=d.width,R.height=d.height),R}this.allocateTextureUnit=Ne,this.resetTextureUnits=j,this.getTextureUnits=ie,this.setTextureUnits=Ae,this.setTexture2D=he,this.setTexture2DArray=Se,this.setTexture3D=Re,this.setTextureCube=me,this.rebindTextures=Mt,this.setupRenderTarget=xt,this.updateRenderTargetMipmap=x,this.updateMultisampleRenderTarget=$e,this.setupDepthRenderbuffer=Et,this.setupFrameBufferTexture=je,this.useMultisampledRTT=ce,this.dispose=Q}function ad(e,n){function t(i,c=$t){let s,u=Je.getTransfer(c);if(i===Ct)return e.UNSIGNED_BYTE;if(i===ti)return e.UNSIGNED_SHORT_4_4_4_4;if(i===ni)return e.UNSIGNED_SHORT_5_5_5_1;if(i===sa)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===la)return e.UNSIGNED_INT_10F_11F_11F_REV;if(i===aa)return e.BYTE;if(i===oa)return e.SHORT;if(i===pn)return e.UNSIGNED_SHORT;if(i===ei)return e.INT;if(i===Vt)return e.UNSIGNED_INT;if(i===yt)return e.FLOAT;if(i===wt)return e.HALF_FLOAT;if(i===ca)return e.ALPHA;if(i===fa)return e.RGB;if(i===Ft)return e.RGBA;if(i===rn)return e.DEPTH_COMPONENT;if(i===Wt)return e.DEPTH_STENCIL;if(i===da)return e.RED;if(i===ii)return e.RED_INTEGER;if(i===Zt)return e.RG;if(i===ri)return e.RG_INTEGER;if(i===ai)return e.RGBA_INTEGER;if(i===An||i===Rn||i===Cn||i===bn)if(u===Xe)if(s=n.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===An)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Rn)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Cn)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===bn)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=n.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===An)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Rn)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Cn)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===bn)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===oi||i===si||i===li||i===ci)if(s=n.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===oi)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===si)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===li)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ci)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===fi||i===di||i===ui||i===pi||i===hi||i===Pn||i===mi)if(s=n.get("WEBGL_compressed_texture_etc"),s!==null){if(i===fi||i===di)return u===Xe?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===ui)return u===Xe?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===pi)return s.COMPRESSED_R11_EAC;if(i===hi)return s.COMPRESSED_SIGNED_R11_EAC;if(i===Pn)return s.COMPRESSED_RG11_EAC;if(i===mi)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===_i||i===gi||i===vi||i===Si||i===Ei||i===Mi||i===xi||i===Ti||i===Ai||i===Ri||i===Ci||i===bi||i===Pi||i===Li)if(s=n.get("WEBGL_compressed_texture_astc"),s!==null){if(i===_i)return u===Xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===gi)return u===Xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===vi)return u===Xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Si)return u===Xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ei)return u===Xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Mi)return u===Xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===xi)return u===Xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ti)return u===Xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ai)return u===Xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ri)return u===Xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ci)return u===Xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===bi)return u===Xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Pi)return u===Xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Li)return u===Xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Di||i===wi||i===Ui)if(s=n.get("EXT_texture_compression_bptc"),s!==null){if(i===Di)return u===Xe?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===wi)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ui)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Ni||i===Ii||i===Ln||i===yi)if(s=n.get("EXT_texture_compression_rgtc"),s!==null){if(i===Ni)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Ii)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ln)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===yi)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Yt?e.UNSIGNED_INT_24_8:e[i]!==void 0?e[i]:null}return{convert:t}}var od=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,sd=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,cr=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(n,t){if(this.texture===null){let i=new Qi(n.texture);(n.depthNear!==t.depthNear||n.depthFar!==t.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=i}}getMesh(n){if(this.texture!==null&&this.mesh===null){let t=n.cameras[0].viewport,i=new Jt({vertexShader:od,fragmentShader:sd,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new kt(new Ji(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},fr=class extends Aa{constructor(n,t){super();let i=this,c=null,s=1,u=null,m="local-floor",N=1,R=null,z=null,y=null,M=null,E=null,L=null,O=typeof XRWebGLBinding<"u",f=new cr,l={},g=t.getContextAttributes(),D=null,S=null,b=[],v=[],o=new ht,p=null,q=null,w=new Nn;w.viewport=new mt;let I=new Nn;I.viewport=new mt;let X=[w,I],Z=new Va,T=null,Q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let he=b[W];return he===void 0&&(he=new Dn,b[W]=he),he.getTargetRaySpace()},this.getControllerGrip=function(W){let he=b[W];return he===void 0&&(he=new Dn,b[W]=he),he.getGripSpace()},this.getHand=function(W){let he=b[W];return he===void 0&&(he=new Dn,b[W]=he),he.getHandSpace()};function Y(W){let he=v.indexOf(W.inputSource);if(he===-1)return;let Se=b[he];Se!==void 0&&(Se.update(W.inputSource,W.frame,R||u),Se.dispatchEvent({type:W.type,data:W.inputSource}))}function H(){c.removeEventListener("select",Y),c.removeEventListener("selectstart",Y),c.removeEventListener("selectend",Y),c.removeEventListener("squeeze",Y),c.removeEventListener("squeezestart",Y),c.removeEventListener("squeezeend",Y),c.removeEventListener("end",H),c.removeEventListener("inputsourceschange",fe);for(let W=0;W<b.length;W++){let he=v[W];he!==null&&(v[W]=null,b[W].disconnect(he))}T=null,Q=null,f.reset();for(let W in l)delete l[W];if(n.setRenderTarget(D),E=null,M=null,y=null,c=null,S=null,Ne.stop(),i.isPresenting=!1,n.setPixelRatio(p),n.setSize(o.width,o.height,!1),q!==null){let W=q.camera;W.fov=q.fov,W.zoom=q.zoom,W.updateProjectionMatrix(),q=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){s=W,i.isPresenting===!0&&He("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){m=W,i.isPresenting===!0&&He("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return R||u},this.setReferenceSpace=function(W){R=W},this.getBaseLayer=function(){return M!==null?M:E},this.getBinding=function(){return y===null&&O&&(y=new XRWebGLBinding(c,t)),y},this.getFrame=function(){return L},this.getSession=function(){return c},this.setSession=async function(W){if(c=W,c!==null){if(D=n.getRenderTarget(),c.addEventListener("select",Y),c.addEventListener("selectstart",Y),c.addEventListener("selectend",Y),c.addEventListener("squeeze",Y),c.addEventListener("squeezestart",Y),c.addEventListener("squeezeend",Y),c.addEventListener("end",H),c.addEventListener("inputsourceschange",fe),g.xrCompatible!==!0&&await t.makeXRCompatible(),p=n.getPixelRatio(),n.getSize(o),O&&"createProjectionLayer"in XRWebGLBinding.prototype){let Se=null,Re=null,me=null;g.depth&&(me=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Se=g.stencil?Wt:rn,Re=g.stencil?Yt:Vt);let Ue={colorFormat:t.RGBA8,depthFormat:me,scaleFactor:s};y=this.getBinding(),M=y.createProjectionLayer(Ue),c.updateRenderState({layers:[M]}),n.setPixelRatio(1),n.setSize(M.textureWidth,M.textureHeight,!1),S=new bt(M.textureWidth,M.textureHeight,{format:Ft,type:Ct,depthTexture:new an(M.textureWidth,M.textureHeight,Re,void 0,void 0,void 0,void 0,void 0,void 0,Se),stencilBuffer:g.stencil,colorSpace:n.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:M.ignoreDepthValues===!1,resolveStencilBuffer:M.ignoreDepthValues===!1,storeMultisampledDepthBuffer:M.ignoreDepthValues===!1,storeMultisampledStencilBuffer:M.ignoreDepthValues===!1})}else{let Se={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};E=new XRWebGLLayer(c,t,Se),c.updateRenderState({baseLayer:E}),n.setPixelRatio(1),n.setSize(E.framebufferWidth,E.framebufferHeight,!1),S=new bt(E.framebufferWidth,E.framebufferHeight,{format:Ft,type:Ct,colorSpace:n.outputColorSpace,stencilBuffer:g.stencil,resolveDepthBuffer:E.ignoreDepthValues===!1,resolveStencilBuffer:E.ignoreDepthValues===!1,storeMultisampledDepthBuffer:E.ignoreDepthValues===!1,storeMultisampledStencilBuffer:E.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(N),R=null,u=await c.requestReferenceSpace(m),Ne.setContext(c),Ne.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(c!==null)return c.environmentBlendMode},this.getDepthTexture=function(){return f.getDepthTexture()};function fe(W){for(let he=0;he<W.removed.length;he++){let Se=W.removed[he],Re=v.indexOf(Se);Re>=0&&(v[Re]=null,b[Re].disconnect(Se))}for(let he=0;he<W.added.length;he++){let Se=W.added[he],Re=v.indexOf(Se);if(Re===-1){for(let Ue=0;Ue<b.length;Ue++)if(Ue>=v.length){v.push(Se),Re=Ue;break}else if(v[Ue]===null){v[Ue]=Se,Re=Ue;break}if(Re===-1)break}let me=b[Re];me&&me.connect(Se)}}function K(W,he){he===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(he.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(c===null)return;let he=W.near,Se=W.far;f.texture!==null&&(f.depthNear>0&&(he=f.depthNear),f.depthFar>0&&(Se=f.depthFar)),Z.near=I.near=w.near=he,Z.far=I.far=w.far=Se,(T!==Z.near||Q!==Z.far)&&(c.updateRenderState({depthNear:Z.near,depthFar:Z.far}),T=Z.near,Q=Z.far),Z.layers.mask=W.layers.mask|6,w.layers.mask=Z.layers.mask&-5,I.layers.mask=Z.layers.mask&-3;let Re=W.parent,me=Z.cameras;K(Z,Re);for(let Ue=0;Ue<me.length;Ue++)K(me[Ue],Re);Z.projectionMatrix.copy(w.projectionMatrix),Z.projectionMatrixInverse.copy(w.projectionMatrixInverse),q===null&&W.isPerspectiveCamera&&(q={camera:W,fov:W.fov,zoom:W.zoom}),j(W,Z,Re)};function j(W,he,Se){Se===null?W.matrix.copy(he.matrixWorld):(W.matrix.copy(Se.matrixWorld),W.matrix.invert(),W.matrix.multiply(he.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(he.projectionMatrix),W.projectionMatrixInverse.copy(he.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=Ra*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return Z},this.getFoveation=function(){if(!(M===null&&E===null))return N},this.setFoveation=function(W){N=W,M!==null&&(M.fixedFoveation=W),E!==null&&E.fixedFoveation!==void 0&&(E.fixedFoveation=W)},this.hasDepthSensing=function(){return f.texture!==null},this.getDepthSensingMesh=function(){return f.getMesh(Z)},this.getCameraTexture=function(W){return l[W]};let ie=null;function Ae(W,he){if(z=he.getViewerPose(R||u),L=he,z!==null){let Se=z.views;E!==null&&(n.setRenderTargetFramebuffer(S,E.framebuffer),n.setRenderTarget(S));let Re=!1;Se.length!==Z.cameras.length&&(Z.cameras.length=0,Re=!0);for(let Ce=0;Ce<Se.length;Ce++){let qe=Se[Ce],ke=null;if(E!==null)ke=E.getViewport(qe);else{let ct=y.getViewSubImage(M,qe);ke=ct.viewport,Ce===0&&(n.setRenderTargetTextures(S,ct.colorTexture,ct.depthStencilTexture),n.setRenderTarget(S))}let Ie=X[Ce];Ie===void 0&&(Ie=new Nn,Ie.layers.enable(Ce),Ie.viewport=new mt,X[Ce]=Ie),Ie.matrix.fromArray(qe.transform.matrix),Ie.matrix.decompose(Ie.position,Ie.quaternion,Ie.scale),Ie.projectionMatrix.fromArray(qe.projectionMatrix),Ie.projectionMatrixInverse.copy(Ie.projectionMatrix).invert(),Ie.viewport.set(ke.x,ke.y,ke.width,ke.height),Ce===0&&(Z.matrix.copy(Ie.matrix),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale)),Re===!0&&Z.cameras.push(Ie)}let me=c.enabledFeatures;if(me&&me.includes("depth-sensing")&&c.depthUsage=="gpu-optimized"&&O){y=i.getBinding();let Ce=y.getDepthInformation(Se[0]);Ce&&Ce.isValid&&Ce.texture&&f.init(Ce,c.renderState)}if(me&&me.includes("camera-access")&&O){n.state.unbindTexture(),y=i.getBinding();for(let Ce=0;Ce<Se.length;Ce++){let qe=Se[Ce].camera;if(qe){let ke=l[qe];ke||(ke=new Qi,l[qe]=ke);let Ie=y.getCameraImage(qe);ke.sourceTexture=Ie}}}}for(let Se=0;Se<b.length;Se++){let Re=v[Se],me=b[Se];Re!==null&&me!==void 0&&me.update(Re,he,R||u)}ie&&ie(W,he),he.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:he}),L=null}let Ne=new co;Ne.setAnimationLoop(Ae),this.setAnimationLoop=function(W){ie=W},this.dispose=function(){}}},ld=new Qt,Eo=new Oe;Eo.set(-1,0,0,0,1,0,0,0,1);function cd(e,n){function t(f,l){f.matrixAutoUpdate===!0&&f.updateMatrix(),l.value.copy(f.matrix)}function i(f,l){l.color.getRGB(f.fogColor.value,ji(e)),l.isFog?(f.fogNear.value=l.near,f.fogFar.value=l.far):l.isFogExp2&&(f.fogDensity.value=l.density)}function c(f,l,g,D,S){l.isNodeMaterial?l.uniformsNeedUpdate=!1:l.isMeshBasicMaterial?s(f,l):l.isMeshLambertMaterial?(s(f,l),l.envMap&&(f.envMapIntensity.value=l.envMapIntensity)):l.isMeshToonMaterial?(s(f,l),y(f,l)):l.isMeshPhongMaterial?(s(f,l),z(f,l),l.envMap&&(f.envMapIntensity.value=l.envMapIntensity)):l.isMeshStandardMaterial?(s(f,l),M(f,l),l.isMeshPhysicalMaterial&&E(f,l,S)):l.isMeshMatcapMaterial?(s(f,l),L(f,l)):l.isMeshDepthMaterial?s(f,l):l.isMeshDistanceMaterial?(s(f,l),O(f,l)):l.isMeshNormalMaterial?s(f,l):l.isLineBasicMaterial?(u(f,l),l.isLineDashedMaterial&&m(f,l)):l.isPointsMaterial?N(f,l,g,D):l.isSpriteMaterial?R(f,l):l.isShadowMaterial?(f.color.value.copy(l.color),f.opacity.value=l.opacity):l.isShaderMaterial&&(l.uniformsNeedUpdate=!1)}function s(f,l){f.opacity.value=l.opacity,l.color&&f.diffuse.value.copy(l.color),l.emissive&&f.emissive.value.copy(l.emissive).multiplyScalar(l.emissiveIntensity),l.map&&(f.map.value=l.map,t(l.map,f.mapTransform)),l.alphaMap&&(f.alphaMap.value=l.alphaMap,t(l.alphaMap,f.alphaMapTransform)),l.bumpMap&&(f.bumpMap.value=l.bumpMap,t(l.bumpMap,f.bumpMapTransform),f.bumpScale.value=l.bumpScale,l.side===St&&(f.bumpScale.value*=-1)),l.normalMap&&(f.normalMap.value=l.normalMap,t(l.normalMap,f.normalMapTransform),f.normalScale.value.copy(l.normalScale),l.side===St&&f.normalScale.value.negate()),l.displacementMap&&(f.displacementMap.value=l.displacementMap,t(l.displacementMap,f.displacementMapTransform),f.displacementScale.value=l.displacementScale,f.displacementBias.value=l.displacementBias),l.emissiveMap&&(f.emissiveMap.value=l.emissiveMap,t(l.emissiveMap,f.emissiveMapTransform)),l.specularMap&&(f.specularMap.value=l.specularMap,t(l.specularMap,f.specularMapTransform)),l.alphaTest>0&&(f.alphaTest.value=l.alphaTest);let g=n.get(l),D=g.envMap,S=g.envMapRotation;D&&(f.envMap.value=D,f.envMapRotation.value.setFromMatrix4(ld.makeRotationFromEuler(S)).transpose(),D.isCubeTexture&&D.isRenderTargetTexture===!1&&f.envMapRotation.value.premultiply(Eo),f.reflectivity.value=l.reflectivity,f.ior.value=l.ior,f.refractionRatio.value=l.refractionRatio),l.lightMap&&(f.lightMap.value=l.lightMap,f.lightMapIntensity.value=l.lightMapIntensity,t(l.lightMap,f.lightMapTransform)),l.aoMap&&(f.aoMap.value=l.aoMap,f.aoMapIntensity.value=l.aoMapIntensity,t(l.aoMap,f.aoMapTransform))}function u(f,l){f.diffuse.value.copy(l.color),f.opacity.value=l.opacity,l.map&&(f.map.value=l.map,t(l.map,f.mapTransform))}function m(f,l){f.dashSize.value=l.dashSize,f.totalSize.value=l.dashSize+l.gapSize,f.scale.value=l.scale}function N(f,l,g,D){f.diffuse.value.copy(l.color),f.opacity.value=l.opacity,f.size.value=l.size*g,f.scale.value=D*.5,l.map&&(f.map.value=l.map,t(l.map,f.uvTransform)),l.alphaMap&&(f.alphaMap.value=l.alphaMap,t(l.alphaMap,f.alphaMapTransform)),l.alphaTest>0&&(f.alphaTest.value=l.alphaTest)}function R(f,l){f.diffuse.value.copy(l.color),f.opacity.value=l.opacity,f.rotation.value=l.rotation,l.map&&(f.map.value=l.map,t(l.map,f.mapTransform)),l.alphaMap&&(f.alphaMap.value=l.alphaMap,t(l.alphaMap,f.alphaMapTransform)),l.alphaTest>0&&(f.alphaTest.value=l.alphaTest)}function z(f,l){f.specular.value.copy(l.specular),f.shininess.value=Math.max(l.shininess,1e-4)}function y(f,l){l.gradientMap&&(f.gradientMap.value=l.gradientMap)}function M(f,l){f.metalness.value=l.metalness,l.metalnessMap&&(f.metalnessMap.value=l.metalnessMap,t(l.metalnessMap,f.metalnessMapTransform)),f.roughness.value=l.roughness,l.roughnessMap&&(f.roughnessMap.value=l.roughnessMap,t(l.roughnessMap,f.roughnessMapTransform)),l.envMap&&(f.envMapIntensity.value=l.envMapIntensity)}function E(f,l,g){f.ior.value=l.ior,l.diffuseRoughness>0&&(f.diffuseRoughness.value=l.diffuseRoughness,l.diffuseRoughnessMap&&(f.diffuseRoughnessMap.value=l.diffuseRoughnessMap,t(l.diffuseRoughnessMap,f.diffuseRoughnessMapTransform))),l.sheen>0&&(f.sheenColor.value.copy(l.sheenColor).multiplyScalar(l.sheen),f.sheenRoughness.value=l.sheenRoughness,l.sheenColorMap&&(f.sheenColorMap.value=l.sheenColorMap,t(l.sheenColorMap,f.sheenColorMapTransform)),l.sheenRoughnessMap&&(f.sheenRoughnessMap.value=l.sheenRoughnessMap,t(l.sheenRoughnessMap,f.sheenRoughnessMapTransform))),l.clearcoat>0&&(f.clearcoat.value=l.clearcoat,f.clearcoatRoughness.value=l.clearcoatRoughness,l.clearcoatMap&&(f.clearcoatMap.value=l.clearcoatMap,t(l.clearcoatMap,f.clearcoatMapTransform)),l.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=l.clearcoatRoughnessMap,t(l.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),l.clearcoatNormalMap&&(f.clearcoatNormalMap.value=l.clearcoatNormalMap,t(l.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(l.clearcoatNormalScale),l.side===St&&f.clearcoatNormalScale.value.negate())),l.dispersion>0&&(f.dispersion.value=l.dispersion),l.retroreflectivity>0&&(f.retroreflectivity.value=l.retroreflectivity),l.iridescence>0&&(f.iridescence.value=l.iridescence,f.iridescenceIOR.value=l.iridescenceIOR,f.iridescenceThicknessMinimum.value=l.iridescenceThicknessMinimum,f.iridescenceThicknessMaximum.value=l.iridescenceThicknessMaximum,l.iridescenceMap&&(f.iridescenceMap.value=l.iridescenceMap,t(l.iridescenceMap,f.iridescenceMapTransform)),l.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=l.iridescenceThicknessMap,t(l.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),l.transmission>0&&(f.transmission.value=l.transmission,f.transmissionSamplerMap.value=g.texture,f.transmissionSamplerSize.value.set(g.width,g.height),l.transmissionMap&&(f.transmissionMap.value=l.transmissionMap,t(l.transmissionMap,f.transmissionMapTransform)),f.thickness.value=l.thickness,l.thicknessMap&&(f.thicknessMap.value=l.thicknessMap,t(l.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=l.attenuationDistance,f.attenuationColor.value.copy(l.attenuationColor)),l.anisotropy>0&&(f.anisotropyVector.value.set(l.anisotropy*Math.cos(l.anisotropyRotation),l.anisotropy*Math.sin(l.anisotropyRotation)),l.anisotropyMap&&(f.anisotropyMap.value=l.anisotropyMap,t(l.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=l.specularIntensity,f.specularColor.value.copy(l.specularColor),l.specularColorMap&&(f.specularColorMap.value=l.specularColorMap,t(l.specularColorMap,f.specularColorMapTransform)),l.specularIntensityMap&&(f.specularIntensityMap.value=l.specularIntensityMap,t(l.specularIntensityMap,f.specularIntensityMapTransform))}function L(f,l){l.matcap&&(f.matcap.value=l.matcap)}function O(f,l){let g=n.get(l).light;f.referencePosition.value.setFromMatrixPosition(g.matrixWorld),f.nearDistance.value=g.shadow.camera.near,f.farDistance.value=g.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:c}}function fd(e,n,t,i){let c={},s={};function u(g,D){let S=D.program;i.uniformBlockBinding(g,S,c[g.id])}function m(g,D){let S=c[g.id];S===void 0&&(L(g),S=N(g),c[g.id]=S,g.addEventListener("dispose",f));let b=D.program;i.updateUBOMapping(g,b);let v=n.render.frame;s[g.id]!==v&&(R(g),s[g.id]=v)}function N(g){let D=e.createBuffer(),S=g.__size,b=g.usage;return e.bindBuffer(e.UNIFORM_BUFFER,D),e.bufferData(e.UNIFORM_BUFFER,S,b),e.bindBuffer(e.UNIFORM_BUFFER,null),D}function R(g){let D=c[g.id],S=g.uniforms,b=g.__cache;e.bindBuffer(e.UNIFORM_BUFFER,D);for(let v=0,o=S.length;v<o;v++){let p=S[v];if(Array.isArray(p))for(let q=0,w=p.length;q<w;q++)z(p[q],v,q,b);else z(p,v,0,b)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function z(g,D,S,b){if(M(g,D,S,b)===!0){let v=g.__offset,o=g.value;if(Array.isArray(o)){let p=0;for(let q=0;q<o.length;q++){let w=o[q],I=O(w,!0);y(w,g.__data,p),p+=I.storage/Float32Array.BYTES_PER_ELEMENT}}else y(o,g.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,v,g.__data)}}function y(g,D,S){typeof g=="number"||typeof g=="boolean"?D[S]=g:g.isMatrix3?(D[S]=g.elements[0],D[S+1]=g.elements[1],D[S+2]=g.elements[2],D[S+3]=0,D[S+4]=g.elements[3],D[S+5]=g.elements[4],D[S+6]=g.elements[5],D[S+7]=0,D[S+8]=g.elements[6],D[S+9]=g.elements[7],D[S+10]=g.elements[8],D[S+11]=0):ArrayBuffer.isView(g)?D.set(g.subarray(0,D.length-S),S):g.toArray(D,S)}function M(g,D,S,b){let v=g.value,o=D+"_"+S;if(Array.isArray(v)){b[o]===void 0&&(b[o]=[]);let p=b[o],q=!1;for(let w=0;w<v.length;w++)E(v[w],p,w)===!0&&(q=!0);return q}return E(v,b,o)}function E(g,D,S){if(D[S]===void 0)return typeof g=="number"||typeof g=="boolean"?D[S]=g:ArrayBuffer.isView(g)?D[S]=g.slice():D[S]=g.clone(),!0;{let b=D[S];if(typeof g=="number"||typeof g=="boolean"){if(b!==g)return D[S]=g,!0}else{if(ArrayBuffer.isView(g))return!0;if(b.equals(g)===!1)return b.copy(g),!0}}return!1}function L(g){let D=g.uniforms,S=0,b=16;for(let o=0,p=D.length;o<p;o++){let q=Array.isArray(D[o])?D[o]:[D[o]];for(let w=0,I=q.length;w<I;w++){let X=q[w],Z=Array.isArray(X.value)?X.value:[X.value],T=Array.isArray(D[o])||Array.isArray(X.value),Q=S;for(let H=0,fe=Z.length;H<fe;H++){let K=Z[H],j=O(K,T),ie=S%b,Ae=ie%j.boundary,Ne=ie+Ae;S+=Ae,Ne!==0&&b-Ne<j.storage&&(S+=b-Ne),H===0&&(Q=S),S+=j.storage}let Y=X.type==="int"?Int32Array:X.type==="uint"?Uint32Array:Float32Array;X.__data=new Y((S-Q)/Float32Array.BYTES_PER_ELEMENT),X.__offset=Q}}let v=S%b;return v>0&&(S+=b-v),g.__size=S,g.__cache={},this}function O(g,D){let S={boundary:0,storage:0};return typeof g=="number"||typeof g=="boolean"?(S.boundary=4,S.storage=4):g.isVector2?(S.boundary=8,S.storage=8):g.isVector3||g.isColor?(S.boundary=16,S.storage=12):g.isVector4?(S.boundary=16,S.storage=16):g.isMatrix3?(S.boundary=16,S.storage=48):g.isMatrix4?(S.boundary=16,S.storage=64):g.isTexture?He("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(g)?(S.boundary=16,S.storage=g.byteLength):He("WebGLRenderer: Unsupported uniform value type.",g),D===!0&&(S.boundary=16,S.storage=Math.ceil(S.storage/16)*16),S}function f(g){let D=g.target;D.removeEventListener("dispose",f),e.deleteBuffer(c[D.id]),delete c[D.id],delete s[D.id]}function l(){for(let g in c)e.deleteBuffer(c[g]);c={},s={}}return{bind:u,update:m,dispose:l}}var dd=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Ut=null;function ud(){return Ut===null&&(Ut=new Ia(dd,16,16,Zt,wt),Ut.name="DFG_LUT",Ut.minFilter=At,Ut.magFilter=At,Ut.wrapS=xn,Ut.wrapT=xn,Ut.generateMipmaps=!1,Ut.needsUpdate=!0),Ut}var dr=class{constructor(n={}){let{canvas:t=Ea(),context:i=null,depth:c=!0,stencil:s=!1,alpha:u=!1,antialias:m=!1,premultipliedAlpha:N=!0,preserveDrawingBuffer:R=!1,powerPreference:z="default",failIfMajorPerformanceCaveat:y=!1,reversedDepthBuffer:M=!1,outputBufferType:E=Ct}=n;this.isWebGLRenderer=!0;let L;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");L=i.getContextAttributes().alpha}else L=u;let O=E,f=new Set([ai,ri,ii]),l=new Set([Ct,Vt,pn,Yt,ti,ni]),g=new Uint32Array(4),D=new Int32Array(4),S={textures:[],min:[],max:[],resolution:[]},b=null,v=null,o=[],p=[],q=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Dt,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let w=this,I=!1,X=null,Z=null,T=null,Q=null;this._outputColorSpace=pa;let Y=0,H=0,fe=null,K=-1,j=null,ie=new mt,Ae=new mt,Ne=null,W=new Ze(0),he=0,Se=t.width,Re=t.height,me=1,Ue=null,gt=null,Ce=new mt(0,0,Se,Re),qe=new mt(0,0,Se,Re),ke=!1,Ie=new Yi,ct=new ya,nt=!1,vt=!1,je=new Qt,Pt=new We,ot=new mt,Et={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Mt=!1;function xt(){return fe===null?me:1}let x=i;function Tt(a,_){return t.getContext(a,_)}let $e,Qe,ce,it,Te,be,d,r,C,$,k,te,se,B,G,re,h,V,F,ae,ee,ne,Me;try{let a={alpha:!0,depth:c,stencil:s,antialias:m,premultipliedAlpha:N,preserveDrawingBuffer:R,powerPreference:z,failIfMajorPerformanceCaveat:y};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"187"}`),t.addEventListener("webglcontextlost",xe,!1),t.addEventListener("webglcontextrestored",Le,!1),t.addEventListener("webglcontextcreationerror",de,!1),x===null){let _="webgl2";if(x=Tt(_,a),x===null)throw Tt(_)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}De()}catch(a){throw t.removeEventListener("webglcontextlost",xe,!1),t.removeEventListener("webglcontextrestored",Le,!1),t.removeEventListener("webglcontextcreationerror",de,!1),Ye("WebGLRenderer: "+a.message),a}function De(){$e=new xc(x),$e.init(),ee=new ad(x,$e),Qe=new dc(x,$e,n,ee),ce=new id(x,$e),Qe.reversedDepthBuffer&&M&&ce.buffers.depth.setReversed(!0),Z=x.createFramebuffer(),T=x.createFramebuffer(),Q=x.createFramebuffer(),it=new Rc(x),Te=new kf,be=new rd(x,$e,ce,Te,Qe,ee,it),d=new Mc(w),r=new bo(x),ne=new cc(x,r),C=new Tc(x,r,it,ne),$=new bc(x,C,r,ne,it),V=new Cc(x,Qe,be),G=new uc(Te),k=new Wf(w,d,$e,Qe,ne,G),te=new cd(w,Te),se=new Xf,B=new Qf($e),h=new lc(w,d,ce,$,L,N),re=new nd(w,$,Qe),Me=new fd(x,it,Qe,ce),F=new fc(x,$e,it),ae=new Ac(x,$e,it),it.programs=k.programs,w.capabilities=Qe,w.extensions=$e,w.properties=Te,w.renderLists=se,w.shadowMap=re,w.state=ce,w.info=it}O!==Ct&&(q=new Lc(O,t.width,t.height,m,c,s));let J=new fr(w,x);this.xr=J,this.getContext=function(){return x},this.getContextAttributes=function(){return x.getContextAttributes()},this.forceContextLoss=function(){let a=$e.get("WEBGL_lose_context");a&&a.loseContext()},this.forceContextRestore=function(){let a=$e.get("WEBGL_lose_context");a&&a.restoreContext()},this.getPixelRatio=function(){return me},this.setPixelRatio=function(a){a!==void 0&&(me=a,this.setSize(Se,Re,!1))},this.getSize=function(a){return a.set(Se,Re)},this.setSize=function(a,_,U=!0){if(J.isPresenting){He("WebGLRenderer: Can't change size while VR device is presenting.");return}Se=a,Re=_,t.width=Math.floor(a*me),t.height=Math.floor(_*me),U===!0&&(t.style.width=a+"px",t.style.height=_+"px"),q!==null&&q.setSize(t.width,t.height),this.setViewport(0,0,a,_)},this.getDrawingBufferSize=function(a){return a.set(Se*me,Re*me).floor()},this.setDrawingBufferSize=function(a,_,U){Se=a,Re=_,me=U,t.width=Math.floor(a*U),t.height=Math.floor(_*U),this.setViewport(0,0,a,_)},this.setEffects=function(a){if(O===Ct){Ye("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(a){for(let _=0;_<a.length;_++)if(a[_].isOutputPass===!0){He("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}q.setEffects(a||[])},this.getCurrentViewport=function(a){return a.copy(ie)},this.getViewport=function(a){return a.copy(Ce)},this.setViewport=function(a,_,U,A){a.isVector4?Ce.set(a.x,a.y,a.z,a.w):Ce.set(a,_,U,A),ce.viewport(ie.copy(Ce).multiplyScalar(xt()).round())},this.getScissor=function(a){return a.copy(qe)},this.setScissor=function(a,_,U,A){a.isVector4?qe.set(a.x,a.y,a.z,a.w):qe.set(a,_,U,A),ce.scissor(Ae.copy(qe).multiplyScalar(xt()).round())},this.getScissorTest=function(){return ke},this.setScissorTest=function(a){ce.setScissorTest(ke=a)},this.setOpaqueSort=function(a){Ue=a},this.setTransparentSort=function(a){gt=a},this.getClearColor=function(a){return a.copy(h.getClearColor())},this.setClearColor=function(){h.setClearColor(...arguments)},this.getClearAlpha=function(){return h.getClearAlpha()},this.setClearAlpha=function(){h.setClearAlpha(...arguments)},this.clear=function(a=!0,_=!0,U=!0){let A=0;if(a){let P=!1;if(fe!==null){let le=fe.texture.format;P=f.has(le)}if(P){let le=fe.texture.type,_e=l.has(le),oe=h.getClearColor(),pe=h.getClearAlpha(),Ee=oe.r,Pe=oe.g,ye=oe.b;_e?(g[0]=Ee,g[1]=Pe,g[2]=ye,g[3]=pe,x.clearBufferuiv(x.COLOR,0,g)):(D[0]=Ee,D[1]=Pe,D[2]=ye,D[3]=pe,x.clearBufferiv(x.COLOR,0,D))}else A|=x.COLOR_BUFFER_BIT}_&&(A|=x.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),U&&(A|=x.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),A!==0&&x.clear(A)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(a){a.setRenderer(this),X=a},this.dispose=function(){t.removeEventListener("webglcontextlost",xe,!1),t.removeEventListener("webglcontextrestored",Le,!1),t.removeEventListener("webglcontextcreationerror",de,!1),h.dispose(),se.dispose(),B.dispose(),be.dispose(),Te.dispose(),d.dispose(),$.dispose(),C.dispose(),ne.dispose(),Me.dispose(),k.dispose(),J.dispose(),J.removeEventListener("sessionstart",pr),J.removeEventListener("sessionend",hr),zt.stop()};function xe(a){a.preventDefault(),zi("WebGLRenderer: Context Lost."),I=!0}function Le(){zi("WebGLRenderer: Context Restored."),I=!1;let a=it.autoReset,_=re.enabled,U=re.autoUpdate,A=re.needsUpdate,P=re.type;De(),it.autoReset=a,re.enabled=_,re.autoUpdate=U,re.needsUpdate=A,re.type=P}function de(a){Ye("WebGLRenderer: A WebGL context could not be created. Reason: ",a.statusMessage)}function Ve(a){let _=a.target;_.removeEventListener("dispose",Ve),st(_)}function st(a){Ot(a),Te.remove(a)}function Ot(a){let _=Te.get(a).programs;_!==void 0&&(_.forEach(function(U){k.releaseProgram(U)}),a.isShaderMaterial&&k.releaseShaderCache(a))}this.renderBufferDirect=function(a,_,U,A,P,le){_===null&&(_=Et);let _e=P.isMesh&&P.matrixWorld.determinantAffine()<0,oe=To(a,_,U,A,P);ce.setMaterial(A,_e);let pe=U.index,Ee=1;if(A.wireframe===!0){if(pe=C.getWireframeAttribute(U),pe===void 0)return;Ee=2}let Pe=U.drawRange,ye=U.attributes.position,ge=Pe.start*Ee,Fe=(Pe.start+Pe.count)*Ee;le!==null&&(ge=Math.max(ge,le.start*Ee),Fe=Math.min(Fe,(le.start+le.count)*Ee)),pe!==null?(ge=Math.max(ge,0),Fe=Math.min(Fe,pe.count)):ye!=null&&(ge=Math.max(ge,0),Fe=Math.min(Fe,ye.count));let tt=Fe-ge;if(tt<0||tt===1/0)return;ne.setup(P,A,oe,U,pe);let Ke,ze=F;if(pe!==null&&(Ke=r.get(pe),ze=ae,ze.setIndex(Ke)),P.isMesh)A.wireframe===!0?(ce.setLineWidth(A.wireframeLinewidth*xt()),ze.setMode(x.LINES)):ze.setMode(x.TRIANGLES);else if(P.isLine){let dt=A.linewidth;dt===void 0&&(dt=1),ce.setLineWidth(dt*xt()),P.isLineSegments?ze.setMode(x.LINES):P.isLineLoop?ze.setMode(x.LINE_LOOP):ze.setMode(x.LINE_STRIP)}else P.isPoints?ze.setMode(x.POINTS):P.isSprite&&ze.setMode(x.TRIANGLES);if(P.isBatchedMesh)if($e.get("WEBGL_multi_draw"))ze.renderMultiDraw(P._multiDrawStarts,P._multiDrawCounts,P._multiDrawCount);else{let dt=P._multiDrawStarts,ve=P._multiDrawCounts,pt=P._multiDrawCount,Ge=pe?r.get(pe).bytesPerElement:1,Xt=Te.get(A).currentProgram.getUniforms();for(let ut=0;ut<pt;ut++)Xt.setValue(x,"_gl_DrawID",ut),ze.render(dt[ut]/Ge,ve[ut])}else if(P.isInstancedMesh)ze.renderInstances(ge,tt,P.count);else if(U.isInstancedBufferGeometry){let dt=U._maxInstanceCount!==void 0?U._maxInstanceCount:1/0,ve=Math.min(U.instanceCount,dt);ze.renderInstances(ge,tt,ve)}else ze.render(ge,tt)};function ur(a,_,U,A){X!==null&&a.isNodeMaterial&&X.setObject(A,a),nt===!0&&G.setState(a,U,!1),a.transparent===!0&&a.side===Lt&&a.forceSinglePass===!1?(a.side=St,a.needsUpdate=!0,ln(a,_,A),a.side=en,a.needsUpdate=!0,ln(a,_,A),a.side=Lt):ln(a,_,A)}this.compile=function(a,_,U=null){U===null&&(U=a),X!==null&&X.renderStart(a,_,U),v=B.get(U),v.init(_),p.push(v),U.traverseVisible(function(P){P.isLight&&P.layers.test(_.layers)&&(v.pushLight(P),P.castShadow&&v.pushShadow(P))}),a!==U&&a.traverseVisible(function(P){P.isLight&&P.layers.test(_.layers)&&(v.pushLight(P),P.castShadow&&v.pushShadow(P))}),v.setupLights(),X!==null&&X.updateLights(v.state.lightsArray),vt=this.localClippingEnabled,nt=G.init(this.clippingPlanes,vt),nt===!0&&G.setGlobalState(this.clippingPlanes,_),X!==null&&re.render(v.state.shadowsArray,U,_);let A=new Set;return a.traverse(function(P){if(!(P.isMesh||P.isPoints||P.isLine||P.isSprite))return;let le=P.material;if(le)if(Array.isArray(le))for(let _e=0;_e<le.length;_e++){let oe=le[_e];ur(oe,U,_,P),A.add(oe)}else ur(le,U,_,P),A.add(le)}),v=p.pop(),X!==null&&X.renderEnd(),A},this.compileAsync=function(a,_,U=null){let A=this.compile(a,_,U);return new Promise(P=>{function le(){if(A.forEach(function(_e){let pe=Te.get(_e).currentProgram;(pe===void 0||pe.isReady())&&A.delete(_e)}),A.size===0){P(a);return}setTimeout(le,10)}$e.get("KHR_parallel_shader_compile")!==null?le():setTimeout(le,10)})};let Hn=null;function Mo(a){Hn&&Hn(a)}function pr(){zt.stop()}function hr(){zt.start()}let zt=new co;zt.setAnimationLoop(Mo),typeof self<"u"&&zt.setContext(self),this.setAnimationLoop=function(a){Hn=a,J.setAnimationLoop(a),a===null?zt.stop():zt.start()},J.addEventListener("sessionstart",pr),J.addEventListener("sessionend",hr),this.render=function(a,_){if(_!==void 0&&_.isCamera!==!0){Ye("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;X!==null&&X.renderStart(a,_);let U=J.enabled===!0&&J.isPresenting===!0,A=q!==null&&(fe===null||U)&&q.begin(w,fe);if(a.matrixWorldAutoUpdate===!0&&a.updateMatrixWorld(),_.parent===null&&_.matrixWorldAutoUpdate===!0&&_.updateMatrixWorld(),J.enabled===!0&&J.isPresenting===!0&&(q===null||q.isCompositing()===!1)&&(J.cameraAutoUpdate===!0&&J.updateCamera(_),_=J.getCamera()),a.isScene===!0&&a.onBeforeRender(w,a,_,fe),v=B.get(a,p.length),v.init(_),v.state.textureUnits=be.getTextureUnits(),p.push(v),je.multiplyMatrices(_.projectionMatrix,_.matrixWorldInverse),_.isArrayCamera?ct.setFromArrayCamera(_):Ie.setFromProjectionMatrix(je,ki,_.reversedDepth),vt=this.localClippingEnabled,nt=G.init(this.clippingPlanes,vt),b=se.get(a,o.length),b.init(),o.push(b),this.info.render.frame++,J.enabled===!0&&J.isPresenting===!0){let _e=w.xr.getDepthSensingMesh();_e!==null&&Vn(_e,_,-1/0,w.sortObjects)}Vn(a,_,0,w.sortObjects),b.finish(),X!==null&&X.updateLights(v.state.lightsArray),w.sortObjects===!0&&b.sort(Ue,gt),Mt=J.enabled===!1||J.isPresenting===!1||J.hasDepthSensing()===!1,Mt&&h.addToRenderList(b,a),this.info.autoReset===!0&&this.info.reset(),nt===!0&&G.beginShadows();let P=v.state.shadowsArray;if(re.render(P,a,_),nt===!0&&G.endShadows(),(A&&q.hasRenderPass())===!1){let _e=b.opaque,oe=b.transmissive;if(v.setupLights(),_.isArrayCamera){let pe=_.cameras;if(oe.length>0)for(let Ee=0,Pe=pe.length;Ee<Pe;Ee++){let ye=pe[Ee];_r(_e,oe,a,ye)}Mt&&h.render(a);for(let Ee=0,Pe=pe.length;Ee<Pe;Ee++){let ye=pe[Ee];mr(b,a,ye,ye.viewport)}}else oe.length>0&&_r(_e,oe,a,_),Mt&&h.render(a),mr(b,a,_)}fe!==null&&H===0&&(be.updateMultisampleRenderTarget(fe),be.updateRenderTargetMipmap(fe)),A&&q.end(w),a.isScene===!0&&a.onAfterRender(w,a,_),ne.resetDefaultState(),K=-1,j=null,p.pop(),p.length>0?(v=p[p.length-1],be.setTextureUnits(v.state.textureUnits),nt===!0&&G.setGlobalState(w.clippingPlanes,v.state.camera)):v=null,o.pop(),o.length>0?b=o[o.length-1]:b=null,X!==null&&X.renderEnd()};function Vn(a,_,U,A){if(a.visible===!1)return;if(a.layers.test(_.layers)){if(a.isGroup)U=a.renderOrder;else if(a.isLOD)a.autoUpdate===!0&&a.update(_);else if(a.isLight)v.pushLight(a),a.castShadow&&v.pushShadow(a);else if(a.isSprite){let _e=_.isArrayCamera?ct:Ie;if(!a.frustumCulled||a.intersectsFrustum(_e)){A&&ot.setFromMatrixPosition(a.matrixWorld).applyMatrix4(je);let oe=$.update(a),pe=a.material;pe.visible&&b.push(a,oe,pe,U,ot.z,null,_)}}else if(a.isMesh||a.isLine||a.isPoints){let _e=_.isArrayCamera?ct:Ie;if(!a.frustumCulled||a.intersectsFrustum(_e)){let oe=$.update(a),pe=a.material;if(A&&(a.boundingSphere!==void 0?(a.boundingSphere===null&&a.computeBoundingSphere(),ot.copy(a.boundingSphere.center)):(oe.boundingSphere===null&&oe.computeBoundingSphere(),ot.copy(oe.boundingSphere.center)),ot.applyMatrix4(a.matrixWorld).applyMatrix4(je)),Array.isArray(pe)){let Ee=oe.groups;for(let Pe=0,ye=Ee.length;Pe<ye;Pe++){let ge=Ee[Pe],Fe=pe[ge.materialIndex];Fe&&Fe.visible&&b.push(a,oe,Fe,U,ot.z,ge,_)}}else pe.visible&&b.push(a,oe,pe,U,ot.z,null,_)}}}let le=a.children;for(let _e=0,oe=le.length;_e<oe;_e++)Vn(le[_e],_,U,A)}function mr(a,_,U,A){let{opaque:P,transmissive:le,transparent:_e}=a;v.setupLightsView(U),nt===!0&&G.setGlobalState(w.clippingPlanes,U),A&&ce.viewport(ie.copy(A)),P.length>0&&vn(P,_,U),le.length>0&&vn(le,_,U),_e.length>0&&vn(_e,_,U),ce.buffers.depth.setTest(!0),ce.buffers.depth.setMask(!0),ce.buffers.color.setMask(!0),ce.setPolygonOffset(!1)}function _r(a,_,U,A){if((U.isScene===!0?U.overrideMaterial:null)!==null)return;if(v.state.transmissionRenderTarget[A.id]===void 0){let ge=$e.has("EXT_color_buffer_half_float")||$e.has("EXT_color_buffer_float");v.state.transmissionRenderTarget[A.id]=new bt(1,1,{generateMipmaps:!0,type:ge?wt:Ct,minFilter:Ht,samples:Math.max(4,Qe.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Je.workingColorSpace})}let le=v.state.transmissionRenderTarget[A.id],_e=A.viewport||ie;le.setSize(_e.z*w.transmissionResolutionScale,_e.w*w.transmissionResolutionScale);let oe=w.getRenderTarget(),pe=w.getActiveCubeFace(),Ee=w.getActiveMipmapLevel();w.setRenderTarget(le),w.getClearColor(W),he=w.getClearAlpha(),he<1&&w.setClearColor(16777215,.5),w.clear(),Mt&&h.render(U);let Pe=w.toneMapping;w.toneMapping=Dt;let ye=A.viewport;if(A.viewport!==void 0&&(A.viewport=void 0),v.setupLightsView(A),nt===!0&&G.setGlobalState(w.clippingPlanes,A),vn(a,U,A),be.updateMultisampleRenderTarget(le),be.updateRenderTargetMipmap(le),$e.has("WEBGL_multisampled_render_to_texture")===!1){let ge=!1;for(let Fe=0,tt=_.length;Fe<tt;Fe++){let Ke=_[Fe],{object:ze,geometry:dt,material:ve,group:pt}=Ke;if(ve.side===Lt&&ze.layers.test(A.layers)){let Ge=ve.side;ve.side=St,ve.needsUpdate=!0,gr(ze,U,A,dt,ve,pt),ve.side=Ge,ve.needsUpdate=!0,ge=!0}}ge===!0&&(be.updateMultisampleRenderTarget(le),be.updateRenderTargetMipmap(le))}w.setRenderTarget(oe,pe,Ee),w.setClearColor(W,he),ye!==void 0&&(A.viewport=ye),w.toneMapping=Pe}function vn(a,_,U){let A=_.isScene===!0?_.overrideMaterial:null;for(let P=0,le=a.length;P<le;P++){let _e=a[P],{object:oe,geometry:pe,group:Ee}=_e,Pe=_e.material;Pe.allowOverride===!0&&A!==null&&(Pe=A),oe.layers.test(U.layers)&&gr(oe,_,U,pe,Pe,Ee)}}function gr(a,_,U,A,P,le){X!==null&&P.isNodeMaterial&&X.setObject(a,P),a.onBeforeRender(w,_,U,A,P,le),a.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,a.matrixWorld),a.normalMatrix.getNormalMatrix(a.modelViewMatrix),P.onBeforeRender(w,_,U,A,a,le),P.transparent===!0&&P.side===Lt&&P.forceSinglePass===!1?(P.side=St,P.needsUpdate=!0,w.renderBufferDirect(U,_,A,P,a,le),P.side=en,P.needsUpdate=!0,w.renderBufferDirect(U,_,A,P,a,le),P.side=Lt):w.renderBufferDirect(U,_,A,P,a,le),a.onAfterRender(w,_,U,A,P,le)}function vr(a){let _=0;for(let U of a)U.texture!==null&&_++;return _}function ln(a,_,U){_.isScene!==!0&&(_=Et);let A=Te.get(a),P=v.state.lights,le=v.state.shadowsArray,_e=P.state.version,oe=k.getParameters(a,P.state,le,_,U,v.state.lightProbeGridArray),pe=k.getProgramCacheKey(oe),Ee=A.programs;A.environment=a.isMeshStandardMaterial||a.isMeshLambertMaterial||a.isMeshPhongMaterial?_.environment:null,A.fog=_.fog;let Pe=a.isMeshStandardMaterial||a.isMeshLambertMaterial&&!a.envMap||a.isMeshPhongMaterial&&!a.envMap;A.envMap=d.get(a.envMap||A.environment,Pe),A.envMapRotation=A.environment!==null&&a.envMap===null?_.environmentRotation:a.envMapRotation,Ee===void 0&&(a.addEventListener("dispose",Ve),Ee=new Map,A.programs=Ee,A.programVariants=new Map);let ye=Ee.get(pe);if(ye!==void 0){if(A.currentProgram===ye&&A.lightsStateVersion===_e)return Er(a,oe),ye}else oe.uniforms=k.getUniforms(a),X!==null&&a.isNodeMaterial&&X.build(a,U,oe),a.onBeforeCompile(oe,w),ye=k.acquireProgram(oe,pe),Ee.set(pe,ye),A.uniforms=oe.uniforms;let ge=A.uniforms;return(!a.isShaderMaterial&&!a.isRawShaderMaterial||a.clipping===!0)&&(ge.clippingPlanes=G.uniform),Er(a,oe),A.needsLights=Ro(a),A.lightsStateVersion=_e,A.needsLights&&(ge.ambientLightColor.value=P.state.ambient,ge.lightProbe.value=P.state.probe,ge.sunLights.value=P.state.sun,ge.sunLightShadows.value=P.state.sunShadow,ge.directionalLights.value=P.state.directional,ge.directionalLightShadows.value=P.state.directionalShadow,ge.spotLights.value=P.state.spot,ge.spotLightShadows.value=P.state.spotShadow,ge.rectAreaLights.value=P.state.rectArea,ge.ltc_1.value=P.state.rectAreaLTC1,ge.ltc_2.value=P.state.rectAreaLTC2,ge.pointLights.value=P.state.point,ge.pointLightShadows.value=P.state.pointShadow,ge.hemisphereLights.value=P.state.hemi,ge.sunShadowMatrix.value=P.state.sunShadowMatrix,ge.sunShadowCascade.value=P.state.sunShadowCascade,ge.directionalShadowMatrix.value=P.state.directionalShadowMatrix,ge.spotLightMatrix.value=P.state.spotLightMatrix,ge.spotLightMap.value=P.state.spotLightMap,ge.pointShadowMatrix.value=P.state.pointShadowMatrix),A.numLightProbeGrids=vr(v.state.lightProbeGridArray),A.currentProgram=ye,A.uniformsList=null,ye}function xo(a,_,U,A,P){let le=Te.get(a),_e=le.currentProgram.id+","+A+","+P,oe=le.programVariants.get(_e);return oe===void 0?(oe=ln(a,_,U),le.programVariants.set(_e,oe)):(le.currentProgram=oe,le.uniformsList=null,le.outputColorSpace=A,le.toneMapping=P),oe}function Sr(a){if(a.uniformsList===null){let _=a.currentProgram.getUniforms();a.uniformsList=on.seqWithValue(_.seq,a.uniforms)}return a.uniformsList}function Er(a,_){let U=Te.get(a);U.outputColorSpace=_.outputColorSpace,U.batching=_.batching,U.batchingColor=_.batchingColor,U.instancing=_.instancing,U.instancingColor=_.instancingColor,U.instancingMorph=_.instancingMorph,U.skinning=_.skinning,U.morphTargets=_.morphTargets,U.morphNormals=_.morphNormals,U.morphColors=_.morphColors,U.morphTargetsCount=_.morphTargetsCount,U.numClippingPlanes=_.numClippingPlanes,U.numIntersection=_.numClipIntersection,U.vertexAlphas=_.vertexAlphas,U.vertexTangents=_.vertexTangents,U.toneMapping=_.toneMapping}function To(a,_,U,A,P){_.isScene!==!0&&(_=Et),be.resetTextureUnits();let le=_.fog,_e=A.isMeshStandardMaterial||A.isMeshLambertMaterial||A.isMeshPhongMaterial?_.environment:null,oe=fe===null?w.outputColorSpace:fe.isXRRenderTarget===!0?fe.texture.colorSpace:Je.workingColorSpace,pe=A.isMeshStandardMaterial||A.isMeshLambertMaterial&&!A.envMap||A.isMeshPhongMaterial&&!A.envMap,Ee=d.get(A.envMap||_e,pe),Pe=A.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,ye=!!U.attributes.tangent&&(!!A.normalMap||A.anisotropy>0),ge=!!U.morphAttributes.position,Fe=!!U.morphAttributes.normal,tt=!!U.morphAttributes.color,Ke=Dt;A.toneMapped&&(fe===null||fe.isXRRenderTarget===!0)&&(Ke=w.toneMapping);let ze=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,dt=ze!==void 0?ze.length:0,ve=Te.get(A),pt=v.state.lights;if(nt===!0&&(vt===!0||a!==j)){let et=a===j&&A.id===K;G.setState(A,a,et)}let Ge=!1,Xt=!1;A.version===ve.__version?ve.needsLights&&ve.lightsStateVersion!==pt.state.version||P.isBatchedMesh&&ve.batching===!1||!P.isBatchedMesh&&ve.batching===!0||P.isBatchedMesh&&ve.batchingColor===!0&&P._colorsTexture===null||P.isBatchedMesh&&ve.batchingColor===!1&&P._colorsTexture!==null||P.isInstancedMesh&&ve.instancing===!1||!P.isInstancedMesh&&ve.instancing===!0||P.isSkinnedMesh&&ve.skinning===!1||!P.isSkinnedMesh&&ve.skinning===!0||P.isInstancedMesh&&ve.instancingColor===!0&&P.instanceColor===null||P.isInstancedMesh&&ve.instancingColor===!1&&P.instanceColor!==null||P.isInstancedMesh&&ve.instancingMorph===!0&&P.morphTexture===null||P.isInstancedMesh&&ve.instancingMorph===!1&&P.morphTexture!==null||ve.envMap!==Ee||A.fog===!0&&ve.fog!==le||ve.numClippingPlanes!==void 0&&(ve.numClippingPlanes!==G.numPlanes||ve.numIntersection!==G.numIntersection)||ve.vertexAlphas!==Pe||ve.vertexTangents!==ye||ve.morphTargets!==ge||ve.morphNormals!==Fe||ve.morphColors!==tt||ve.morphTargetsCount!==dt||ve.numLightProbeGrids!==vr(v.state.lightProbeGridArray)?Ge=!0:(ve.outputColorSpace!==oe||ve.toneMapping!==Ke)&&(Xt=!0):(Ge=!0,ve.__version=A.version);let ut=ve.currentProgram;(Ge===!0||Xt===!0)&&(ut=Xt===!0?xo(A,_,P,oe,Ke):ln(A,_,P),X&&A.isNodeMaterial&&X.onUpdateProgram(A,ut,ve));let Sn=!1,Bt=!1,Kt=!1,Be=ut.getUniforms(),ft=ve.uniforms;if(ce.useProgram(ut.program)&&(Sn=!0,Bt=!0,Kt=!0),A.id!==K&&(K=A.id,Bt=!0),Sn||j!==a){ce.buffers.depth.getReversed()&&a.reversedDepth!==!0&&(a._reversedDepth=!0,a.updateProjectionMatrix()),Be.setValue(x,"projectionMatrix",a.projectionMatrix),Be.setValue(x,"viewMatrix",a.matrixWorldInverse);let lt=Be.map.cameraPosition;lt!==void 0&&lt.setValue(x,Pt.setFromMatrixPosition(a.matrixWorld)),Qe.logarithmicDepthBuffer&&Be.setValue(x,"logDepthBufFC",2/(Math.log(a.far+1)/Math.LN2)),(A.isMeshPhongMaterial||A.isMeshToonMaterial||A.isMeshLambertMaterial||A.isMeshBasicMaterial||A.isMeshStandardMaterial||A.isShaderMaterial)&&Be.setValue(x,"isOrthographic",a.isOrthographicCamera===!0),j!==a&&(j=a,Bt=!0,Kt=!0)}if(ve.needsLights&&(pt.state.sunShadowMap.length>0&&Be.setValue(x,"sunShadowMap",pt.state.sunShadowMap,be),pt.state.directionalShadowMap.length>0&&Be.setValue(x,"directionalShadowMap",pt.state.directionalShadowMap,be),pt.state.spotShadowMap.length>0&&Be.setValue(x,"spotShadowMap",pt.state.spotShadowMap,be),pt.state.pointShadowMap.length>0&&Be.setValue(x,"pointShadowMap",pt.state.pointShadowMap,be)),P.isSkinnedMesh){Be.setOptional(x,P,"bindMatrix"),Be.setOptional(x,P,"bindMatrixInverse");let et=P.skeleton;et&&(et.boneTexture===null&&et.computeBoneTexture(),Be.setValue(x,"boneTexture",et.boneTexture,be))}P.isBatchedMesh&&(Be.setOptional(x,P,"batchingTexture"),Be.setValue(x,"batchingTexture",P._matricesTexture,be),Be.setOptional(x,P,"batchingIdTexture"),Be.setValue(x,"batchingIdTexture",P._indirectTexture,be),Be.setOptional(x,P,"batchingColorTexture"),P._colorsTexture!==null&&Be.setValue(x,"batchingColorTexture",P._colorsTexture,be));let Rt=U.morphAttributes;if((Rt.position!==void 0||Rt.normal!==void 0||Rt.color!==void 0)&&V.update(P,U,ut),(Bt||ve.receiveShadow!==P.receiveShadow)&&(ve.receiveShadow=P.receiveShadow,Be.setValue(x,"receiveShadow",P.receiveShadow)),(A.isMeshStandardMaterial||A.isMeshLambertMaterial||A.isMeshPhongMaterial)&&A.envMap===null&&_.environment!==null&&(ft.envMapIntensity.value=_.environmentIntensity),ft.dfgLUT!==void 0&&(ft.dfgLUT.value=ud()),Bt){if(Be.setValue(x,"toneMappingExposure",w.toneMappingExposure),ve.needsLights&&Ao(ft,Kt),le&&A.fog===!0&&te.refreshFogUniforms(ft,le),te.refreshMaterialUniforms(ft,A,me,Re,v.state.transmissionRenderTarget[a.id]),ve.needsLights&&ve.numLightProbeGrids>0){let et=S,lt=0;for(let It of v.state.lightProbeGridArray)It.texture!==null&&(et.textures[lt]=It.texture,et.min[lt]=It.boundingBox.min,et.max[lt]=It.boundingBox.max,et.resolution[lt]=It.resolution,lt++);for(let It in et)et[It].length=lt;ft.probesSH.value=et.textures,ft.probesMin.value=et.min,ft.probesMax.value=et.max,ft.probesResolution.value=et.resolution}on.upload(x,Sr(ve),ft,be)}if(A.isShaderMaterial&&A.uniformsNeedUpdate===!0&&(on.upload(x,Sr(ve),ft,be),A.uniformsNeedUpdate=!1),A.isSpriteMaterial&&Be.setValue(x,"center",P.center),Be.setValue(x,"modelViewMatrix",P.modelViewMatrix),Be.setValue(x,"normalMatrix",P.normalMatrix),Be.setValue(x,"modelMatrix",P.matrixWorld),A.uniformsGroups!==void 0){let et=A.uniformsGroups;for(let lt=0,It=et.length;lt<It;lt++){let xr=et[lt];Me.update(xr,ut),Me.bind(xr,ut)}}return ut}function Ao(a,_){a.ambientLightColor.needsUpdate=_,a.lightProbe.needsUpdate=_,a.sunLights.needsUpdate=_,a.sunLightShadows.needsUpdate=_,a.directionalLights.needsUpdate=_,a.directionalLightShadows.needsUpdate=_,a.pointLights.needsUpdate=_,a.pointLightShadows.needsUpdate=_,a.spotLights.needsUpdate=_,a.spotLightShadows.needsUpdate=_,a.rectAreaLights.needsUpdate=_,a.hemisphereLights.needsUpdate=_}function Ro(a){return a.isMeshLambertMaterial||a.isMeshToonMaterial||a.isMeshPhongMaterial||a.isMeshStandardMaterial||a.isShadowMaterial||a.isShaderMaterial&&a.lights===!0}this.getActiveCubeFace=function(){return Y},this.getActiveMipmapLevel=function(){return H},this.getRenderTarget=function(){return fe},this.setRenderTargetTextures=function(a,_,U){let A=Te.get(a);A.__autoAllocateDepthBuffer=a.resolveDepthBuffer===!1,A.__autoAllocateDepthBuffer===!1&&(A.__useRenderToTexture=!1),Te.get(a.texture).__webglTexture=_,Te.get(a.depthTexture).__webglTexture=A.__autoAllocateDepthBuffer?void 0:U,A.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(a,_){let U=Te.get(a);U.__webglFramebuffer=_,U.__useDefaultFramebuffer=_===void 0},this.setRenderTarget=function(a,_=0,U=0){fe=a,Y=_,H=U;let A=null,P=!1,le=!1;if(a){let oe=Te.get(a);if(oe.__useDefaultFramebuffer!==void 0){ce.bindFramebuffer(x.FRAMEBUFFER,oe.__webglFramebuffer),ie.copy(a.viewport),Ae.copy(a.scissor),Ne=a.scissorTest,ce.viewport(ie),ce.scissor(Ae),ce.setScissorTest(Ne),K=-1;return}else if(oe.__webglFramebuffer===void 0)be.setupRenderTarget(a);else if(oe.__hasExternalTextures)be.rebindTextures(a,Te.get(a.texture).__webglTexture,Te.get(a.depthTexture).__webglTexture);else if(a.depthBuffer){let Pe=a.depthTexture;if(oe.__boundDepthTexture!==Pe){if(Pe!==null&&Te.has(Pe)&&(a.width!==Pe.image.width||a.height!==Pe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");be.setupDepthRenderbuffer(a)}}let pe=a.texture;(pe.isData3DTexture||pe.isDataArrayTexture||pe.isCompressedArrayTexture)&&(le=!0);let Ee=Te.get(a).__webglFramebuffer;a.isWebGLCubeRenderTarget?(Array.isArray(Ee[_])?A=Ee[_][U]:A=Ee[_],P=!0):a.samples>0&&be.useMultisampledRTT(a)===!1?A=Te.get(a).__webglMultisampledFramebuffer:Array.isArray(Ee)?A=Ee[U]:A=Ee,ie.copy(a.viewport),Ae.copy(a.scissor),Ne=a.scissorTest}else ie.copy(Ce).multiplyScalar(me).floor(),Ae.copy(qe).multiplyScalar(me).floor(),Ne=ke;if(U!==0&&(A=Z),ce.bindFramebuffer(x.FRAMEBUFFER,A)&&ce.drawBuffers(a,A),ce.viewport(ie),ce.scissor(Ae),ce.setScissorTest(Ne),P){let oe=Te.get(a.texture);x.framebufferTexture2D(x.FRAMEBUFFER,x.COLOR_ATTACHMENT0,x.TEXTURE_CUBE_MAP_POSITIVE_X+_,oe.__webglTexture,U)}else if(le){let oe=_;for(let pe=0;pe<a.textures.length;pe++){let Ee=Te.get(a.textures[pe]);x.framebufferTextureLayer(x.FRAMEBUFFER,x.COLOR_ATTACHMENT0+pe,Ee.__webglTexture,U,oe)}}else if(a!==null&&U!==0){let oe=Te.get(a.texture);x.framebufferTexture2D(x.FRAMEBUFFER,x.COLOR_ATTACHMENT0,x.TEXTURE_2D,oe.__webglTexture,U)}K=-1};function Mr(a){let _=Te.get(a);return(_.__readFormat!==a.format||_.__readType!==a.type)&&(_.__readFormat=a.format,_.__readType=a.type,_.__formatReadable=Qe.textureFormatReadable(a.format),_.__typeReadable=Qe.textureTypeReadable(a.type)),_}this.readRenderTargetPixels=function(a,_,U,A,P,le,_e,oe=0){if(!(a&&a.isWebGLRenderTarget)){Ye("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let pe=Te.get(a).__webglFramebuffer;if(a.isWebGLCubeRenderTarget&&_e!==void 0&&(pe=pe[_e],Array.isArray(pe)&&(pe=pe[0])),pe){ce.bindFramebuffer(x.FRAMEBUFFER,pe);try{let Ee=a.textures[oe],Pe=Ee.format,ye=Ee.type;a.textures.length>1&&x.readBuffer(x.COLOR_ATTACHMENT0+oe);let ge=Mr(Ee);if(ge.__formatReadable===!1){Ye("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(ge.__typeReadable===!1){Ye("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}_>=0&&_<=a.width-A&&U>=0&&U<=a.height-P&&x.readPixels(_,U,A,P,ee.convert(Pe),ee.convert(ye),le)}finally{let Ee=fe!==null?Te.get(fe).__webglFramebuffer:null;ce.bindFramebuffer(x.FRAMEBUFFER,Ee)}}},this.readRenderTargetPixelsAsync=async function(a,_,U,A,P,le,_e,oe=0){if(!(a&&a.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let pe=Te.get(a).__webglFramebuffer;if(a.isWebGLCubeRenderTarget&&_e!==void 0&&(pe=pe[_e],Array.isArray(pe)&&(pe=pe[0])),pe)if(_>=0&&_<=a.width-A&&U>=0&&U<=a.height-P){ce.bindFramebuffer(x.FRAMEBUFFER,pe);let Ee=a.textures[oe],Pe=Ee.format,ye=Ee.type;a.textures.length>1&&x.readBuffer(x.COLOR_ATTACHMENT0+oe);let ge=Mr(Ee);if(ge.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(ge.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Fe=x.createBuffer();x.bindBuffer(x.PIXEL_PACK_BUFFER,Fe),x.bufferData(x.PIXEL_PACK_BUFFER,le.byteLength,x.STREAM_READ),x.readPixels(_,U,A,P,ee.convert(Pe),ee.convert(ye),0),x.bindBuffer(x.PIXEL_PACK_BUFFER,null);let tt=fe!==null?Te.get(fe).__webglFramebuffer:null;ce.bindFramebuffer(x.FRAMEBUFFER,tt);let Ke=x.fenceSync(x.SYNC_GPU_COMMANDS_COMPLETE,0);return x.flush(),await xa(x,Ke,4),x.bindBuffer(x.PIXEL_PACK_BUFFER,Fe),x.getBufferSubData(x.PIXEL_PACK_BUFFER,0,le),x.bindBuffer(x.PIXEL_PACK_BUFFER,null),x.deleteBuffer(Fe),x.deleteSync(Ke),le}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(a,_=null,U=0){let A=Math.pow(2,-U),P=Math.floor(a.image.width*A),le=Math.floor(a.image.height*A),_e=_!==null?_.x:0,oe=_!==null?_.y:0;be.setTexture2D(a,0),x.copyTexSubImage2D(x.TEXTURE_2D,U,0,0,_e,oe,P,le),ce.unbindTexture()},this.copyTextureToTexture=function(a,_,U=null,A=null,P=0,le=0){let _e,oe,pe,Ee,Pe,ye,ge,Fe,tt,Ke=a.isCompressedTexture?a.mipmaps[le]:a.image;if(U!==null)_e=U.max.x-U.min.x,oe=U.max.y-U.min.y,pe=U.isBox3?U.max.z-U.min.z:1,Ee=U.min.x,Pe=U.min.y,ye=U.isBox3?U.min.z:0;else{let Be=Math.pow(2,-P);_e=Math.floor(Ke.width*Be),oe=Math.floor(Ke.height*Be),a.isDataArrayTexture?pe=Ke.depth:a.isData3DTexture?pe=Math.floor(Ke.depth*Be):pe=1,Ee=0,Pe=0,ye=0}A!==null?(ge=A.x,Fe=A.y,tt=A.z):(ge=0,Fe=0,tt=0);let ze=ee.convert(_.format),dt=ee.convert(_.type),ve;_.isData3DTexture?(be.setTexture3D(_,0),ve=x.TEXTURE_3D):_.isDataArrayTexture||_.isCompressedArrayTexture?(be.setTexture2DArray(_,0),ve=x.TEXTURE_2D_ARRAY):(be.setTexture2D(_,0),ve=x.TEXTURE_2D),ce.activeTexture(x.TEXTURE0),ce.pixelStorei(x.UNPACK_FLIP_Y_WEBGL,_.flipY),ce.pixelStorei(x.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),ce.pixelStorei(x.UNPACK_ALIGNMENT,_.unpackAlignment);let pt=ce.getParameter(x.UNPACK_ROW_LENGTH),Ge=ce.getParameter(x.UNPACK_IMAGE_HEIGHT),Xt=ce.getParameter(x.UNPACK_SKIP_PIXELS),ut=ce.getParameter(x.UNPACK_SKIP_ROWS),Sn=ce.getParameter(x.UNPACK_SKIP_IMAGES);ce.pixelStorei(x.UNPACK_ROW_LENGTH,Ke.width),ce.pixelStorei(x.UNPACK_IMAGE_HEIGHT,Ke.height),ce.pixelStorei(x.UNPACK_SKIP_PIXELS,Ee),ce.pixelStorei(x.UNPACK_SKIP_ROWS,Pe),ce.pixelStorei(x.UNPACK_SKIP_IMAGES,ye);let Bt=a.isDataArrayTexture||a.isData3DTexture,Kt=_.isDataArrayTexture||_.isData3DTexture;if(a.isDepthTexture){let Be=Te.get(a),ft=Te.get(_),Rt=Te.get(Be.__renderTarget),et=Te.get(ft.__renderTarget);ce.bindFramebuffer(x.READ_FRAMEBUFFER,Rt.__webglFramebuffer),ce.bindFramebuffer(x.DRAW_FRAMEBUFFER,et.__webglFramebuffer);for(let lt=0;lt<pe;lt++)Bt&&(x.framebufferTextureLayer(x.READ_FRAMEBUFFER,x.COLOR_ATTACHMENT0,Te.get(a).__webglTexture,P,ye+lt),x.framebufferTextureLayer(x.DRAW_FRAMEBUFFER,x.COLOR_ATTACHMENT0,Te.get(_).__webglTexture,le,tt+lt)),x.blitFramebuffer(Ee,Pe,Ee+_e,Pe+oe,ge,Fe,ge+_e,Fe+oe,x.DEPTH_BUFFER_BIT,x.NEAREST);ce.bindFramebuffer(x.READ_FRAMEBUFFER,null),ce.bindFramebuffer(x.DRAW_FRAMEBUFFER,null)}else if(P!==0||a.isRenderTargetTexture||Te.has(a)){let Be=Te.get(a),ft=Te.get(_);ce.bindFramebuffer(x.READ_FRAMEBUFFER,T),ce.bindFramebuffer(x.DRAW_FRAMEBUFFER,Q);for(let Rt=0;Rt<pe;Rt++)Bt?x.framebufferTextureLayer(x.READ_FRAMEBUFFER,x.COLOR_ATTACHMENT0,Be.__webglTexture,P,ye+Rt):x.framebufferTexture2D(x.READ_FRAMEBUFFER,x.COLOR_ATTACHMENT0,x.TEXTURE_2D,Be.__webglTexture,P),Kt?x.framebufferTextureLayer(x.DRAW_FRAMEBUFFER,x.COLOR_ATTACHMENT0,ft.__webglTexture,le,tt+Rt):x.framebufferTexture2D(x.DRAW_FRAMEBUFFER,x.COLOR_ATTACHMENT0,x.TEXTURE_2D,ft.__webglTexture,le),P!==0?x.blitFramebuffer(Ee,Pe,Ee+_e,Pe+oe,ge,Fe,ge+_e,Fe+oe,x.COLOR_BUFFER_BIT,x.NEAREST):Kt?x.copyTexSubImage3D(ve,le,ge,Fe,tt+Rt,Ee,Pe,_e,oe):x.copyTexSubImage2D(ve,le,ge,Fe,Ee,Pe,_e,oe);ce.bindFramebuffer(x.READ_FRAMEBUFFER,null),ce.bindFramebuffer(x.DRAW_FRAMEBUFFER,null)}else Kt?a.isDataTexture||a.isData3DTexture?x.texSubImage3D(ve,le,ge,Fe,tt,_e,oe,pe,ze,dt,Ke.data):_.isCompressedArrayTexture?x.compressedTexSubImage3D(ve,le,ge,Fe,tt,_e,oe,pe,ze,Ke.data):x.texSubImage3D(ve,le,ge,Fe,tt,_e,oe,pe,ze,dt,Ke):a.isDataTexture?x.texSubImage2D(x.TEXTURE_2D,le,ge,Fe,_e,oe,ze,dt,Ke.data):a.isCompressedTexture?x.compressedTexSubImage2D(x.TEXTURE_2D,le,ge,Fe,Ke.width,Ke.height,ze,Ke.data):x.texSubImage2D(x.TEXTURE_2D,le,ge,Fe,_e,oe,ze,dt,Ke);ce.pixelStorei(x.UNPACK_ROW_LENGTH,pt),ce.pixelStorei(x.UNPACK_IMAGE_HEIGHT,Ge),ce.pixelStorei(x.UNPACK_SKIP_PIXELS,Xt),ce.pixelStorei(x.UNPACK_SKIP_ROWS,ut),ce.pixelStorei(x.UNPACK_SKIP_IMAGES,Sn),le===0&&_.generateMipmaps===!0&&_.mipmapsAutoUpdate===!0&&x.generateMipmap(ve),ce.unbindTexture()},this.initRenderTarget=function(a){Te.get(a).__webglFramebuffer===void 0&&be.setupRenderTarget(a)},this.initTexture=function(a){a.isCubeTexture?be.setTextureCube(a,0):a.isData3DTexture?be.setTexture3D(a,0):a.isDataArrayTexture||a.isCompressedArrayTexture?be.setTexture2DArray(a,0):be.setTexture2D(a,0),ce.unbindTexture()},this.resetState=function(){Y=0,H=0,fe=null,ce.reset(),ne.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ki}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(n){this._outputColorSpace=n;let t=this.getContext();t.drawingBufferColorSpace=Je._getDrawingBufferColorSpace(n),t.unpackColorSpace=Je._getUnpackColorSpace()}};export{dr as WebGLRenderer};
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
