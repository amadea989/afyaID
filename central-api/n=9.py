#n=9
#a,b=0,1
#for _ in range (n):
    #print(a, end =" ")
    #a,b=b,a+b
    
    
    
    
#n=12
#a,b=0,1
#for _ in range (n):
    #print (a, end=" ")
    #a,b=b,a+b
    
    
s = "Hello World"
name="Sky"

print(s.lower())        # "hello world"
print(s.upper())        # "HELLO WORLD"
print(s.strip())        # removes leading/trailing whitespace
print(s.split(" "))     # ["Hello", "World"] — breaks into a list
print(s.replace("o", "g"))  # "Hell0 W0rld"
print(s[::-1])          # "dlroW olleH" — reverses the string (classic interview ask)
print (len(s))           # 11 — string length
print(f"Hi {name}")     # f-string: embeds a variable directly into text

type(5)