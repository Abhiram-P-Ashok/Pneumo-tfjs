str='hello world'
l=''
s=''
for j in 'hello world':
    for i in ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',' ']:
        if(i==j):
            l=l+i
            s=l
            print(l)
            break
        else:
            print(s+i)